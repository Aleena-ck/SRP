const mongoose = require('mongoose');

const bloodInventorySchema = new mongoose.Schema({
    // Blood Bank/Hospital Reference
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    
    // Blood Details
    bloodGroup: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    componentType: {
        type: String,
        enum: ['Whole Blood', 'Packed RBC', 'Platelets', 'Plasma', 'Cryoprecipitate'],
        required: true
    },
    
    // Inventory Details
    availableUnits: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    reservedUnits: {
        type: Number,
        default: 0,
        min: 0
    },
    totalUnits: {
        type: Number,
        default: 0
    },
    
    // Storage Information
    storageLocation: String,
    storageTemperature: {
        type: String,
        enum: ['Room Temp', 'Refrigerated (2-6°C)', 'Frozen (-18°C)', 'Frozen (-65°C)']
    },
    batchNumber: String,
    
    // Collection Information
    collectionDate: {
        type: Date,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    
    // Donor Information (if known)
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor'
    },
    donationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation'
    },
    
    // Testing Information
    tested: {
        type: Boolean,
        default: false
    },
    testResults: {
        hiv: { type: Boolean, default: false },
        hepatitisB: { type: Boolean, default: false },
        hepatitisC: { type: Boolean, default: false },
        syphilis: { type: Boolean, default: false },
        malaria: { type: Boolean, default: false },
        testedAt: Date,
        testedBy: String
    },
    
    // Status
    status: {
        type: String,
        enum: ['Available', 'Reserved', 'Transfused', 'Discarded', 'Expired'],
        default: 'Available'
    },
    
    // Usage History
    usageHistory: [{
        requestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BloodRequest'
        },
        patientName: String,
        usedUnits: Number,
        usedAt: Date,
        usedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    
    // Threshold Alerts
    minimumThreshold: {
        type: Number,
        default: 5
    },
    maximumThreshold: {
        type: Number,
        default: 50
    },
    
    // Notes
    notes: String,
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for usable units
bloodInventorySchema.virtual('usableUnits').get(function() {
    return this.availableUnits - this.reservedUnits;
});

// Virtual for days to expiry
bloodInventorySchema.virtual('daysToExpiry').get(function() {
    const now = new Date();
    const expiry = new Date(this.expiryDate);
    const diffTime = expiry - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for shelf life percentage
bloodInventorySchema.virtual('shelfLifePercentage').get(function() {
    const totalLife = this.expiryDate - this.collectionDate;
    const elapsed = Date.now() - this.collectionDate;
    return Math.min(100, Math.max(0, (elapsed / totalLife) * 100));
});

// Virtual for expiry status
bloodInventorySchema.virtual('expiryStatus').get(function() {
    const days = this.daysToExpiry;
    if (days < 0) return 'expired';
    if (days <= 7) return 'critical';
    if (days <= 14) return 'warning';
    return 'safe';
});

// Update total units
bloodInventorySchema.pre('save', function(next) {
    this.totalUnits = this.availableUnits + this.reservedUnits;
    next();
});

// Check if unit is expired
bloodInventorySchema.methods.isExpired = function() {
    return new Date() > this.expiryDate;
};

// Reserve units for a request
bloodInventorySchema.methods.reserveUnits = async function(units, requestId) {
    if (this.usableUnits < units) {
        throw new Error(`Insufficient units. Available: ${this.usableUnits}, Requested: ${units}`);
    }
    
    this.reservedUnits += units;
    this.availableUnits -= units;
    
    return await this.save();
};

// Release reserved units
bloodInventorySchema.methods.releaseUnits = async function(units) {
    if (this.reservedUnits < units) {
        throw new Error(`Cannot release more units than reserved. Reserved: ${this.reservedUnits}, Requested: ${units}`);
    }
    
    this.reservedUnits -= units;
    this.availableUnits += units;
    
    return await this.save();
};

// Mark as used/transfused
bloodInventorySchema.methods.markAsUsed = async function(units, requestId, patientName, usedBy) {
    if (this.availableUnits < units) {
        throw new Error(`Insufficient available units. Available: ${this.availableUnits}, Requested: ${units}`);
    }
    
    this.availableUnits -= units;
    this.status = 'Transfused';
    
    this.usageHistory.push({
        requestId: requestId,
        patientName: patientName,
        usedUnits: units,
        usedAt: new Date(),
        usedBy: usedBy
    });
    
    return await this.save();
};

// Indexes
bloodInventorySchema.index({ adminId: 1, bloodGroup: 1, componentType: 1 });
bloodInventorySchema.index({ expiryDate: 1 });
bloodInventorySchema.index({ status: 1, expiryDate: 1 });
bloodInventorySchema.index({ "testResults.testedAt": 1 });

module.exports = mongoose.model('BloodInventory', bloodInventorySchema);