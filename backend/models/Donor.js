const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    // User reference (ONLY this - rest comes from User model)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    
    // Personal Details (donor-specific)
    age: {
        type: Number,
        required: [true, 'Please enter your age'],
        min: [18, 'You must be at least 18 years old'],
        max: [65, 'Maximum age for donation is 65']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
        required: [true, 'Please select your gender']
    },
    dateOfBirth: Date,
    
    // Guardian Information
    guardianName: {
        type: String,
        required: [true, 'Please enter guardian name'],
        trim: true
    },
    guardianPhone: {
        type: String,
        required: [true, 'Please enter guardian phone number'],
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    guardianRelation: {
        type: String,
        required: [true, 'Please specify relationship with guardian'],
        trim: true
    },
    
    // College Details
    collegeDetails: {
        state: {
            type: String,
            required: [true, 'Please select state'],
            trim: true
        },
        district: {
            type: String,
            required: [true, 'Please select district'],
            trim: true
        },
        collegeName: {
            type: String,
            required: [true, 'Please select college'],
            trim: true
        },
        admissionNumber: {
            type: String,
            required: [true, 'Please enter admission number'],
            unique: true,
            sparse: true,
            trim: true
        },
        department: {
            type: String,
            required: [true, 'Please select department'],
            trim: true
        },
        yearOfStudy: {
            type: String,
            trim: true
        },
        university: {
            type: String,
            trim: true
        }
    },
    
    // Address
    address: {
        street: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            trim: true
        },
        district: {
            type: String,
            trim: true
        },
        state: {
            type: String,
            trim: true
        },
        pincode: {
            type: String,
            match: [/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit pincode']
        },
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                default: [0, 0]
            }
        }
    },
    
    // Donation History & Eligibility
    lastDonationDate: {
        type: Date,
        default: null
    },
    nextEligibleDate: {
        type: Date,
        default: Date.now
    },
    totalDonations: {
        type: Number,
        default: 0
    },
    totalUnitsDonated: {
        type: Number,
        default: 0
    },
    
    // Health Information
    healthInfo: {
        weight: {
            type: Number,
            min: [40, 'Minimum weight required is 40kg']
        },
        height: Number,
        hemoglobin: {
            type: Number,
            min: [12.5, 'Minimum hemoglobin required is 12.5g/dL']
        },
        bloodPressure: String,
        pulseRate: Number,
        lastCheckup: Date,
        isSmoker: {
            type: Boolean,
            default: false
        },
        hasTattoo: {
            type: Boolean,
            default: false
        },
        hasPiercing: {
            type: Boolean,
            default: false
        },
        medicalConditions: [String],
        medications: [String],
        allergies: [String]
    },
    
    // Donor Status
    isAvailable: {
        type: Boolean,
        default: true
    },
    availabilityRadius: {
        type: Number,
        default: 20, // in kilometers
        min: 5,
        max: 100
    },
    preferredDonationType: {
        type: String,
        enum: ['Whole Blood', 'Platelets', 'Plasma', 'Double Red Cells', 'Any'],
        default: 'Whole Blood'
    },
    
    // Contact Preferences
    contactPreferences: {
        sms: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        whatsapp: { type: Boolean, default: false },
        emergencyContact: { type: Boolean, default: true }
    },
    
    // Stats
    donationStreak: {
        type: Number,
        default: 0
    },
    averageDonationInterval: Number,
    
    // Emergency Contacts
    emergencyContacts: [{
        name: {
            type: String,
            trim: true
        },
        relationship: {
            type: String,
            trim: true
        },
        phone: {
            type: String,
            match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
        },
        isPrimary: {
            type: Boolean,
            default: false
        }
    }],
    
    // Documents
    documents: [{
        type: {
            type: String,
            enum: ['ID Proof', 'Medical Certificate', 'Other']
        },
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        },
        verified: {
            type: Boolean,
            default: false
        }
    }],
    
    // Status flags
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationNotes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for full address
donorSchema.virtual('fullAddress').get(function() {
    const parts = [];
    if (this.address?.street) parts.push(this.address.street);
    if (this.address?.city) parts.push(this.address.city);
    if (this.address?.district) parts.push(this.address.district);
    if (this.address?.state) parts.push(this.address.state);
    if (this.address?.pincode) parts.push(`- ${this.address.pincode}`);
    return parts.join(', ') || 'Address not provided';
});

// Virtual for calculated age
donorSchema.virtual('calculatedAge').get(function() {
    if (!this.dateOfBirth) return this.age;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

// Virtual to get user data (for population)
donorSchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
});

// Virtual for formatted donor ID
donorSchema.virtual('formattedDonorId').get(function() {
    // Format: LBD-YYYYMMDD-XXXX (last 4 chars of ID)
    const datePart = this.createdAt 
        ? this.createdAt.toISOString().slice(0,10).replace(/-/g, '')
        : new Date().toISOString().slice(0,10).replace(/-/g, '');
    const idPart = this._id.toString().slice(-4).toUpperCase();
    return `LBD-${datePart}-${idPart}`;
});

// Pre-save middleware
donorSchema.pre('save', function(next) {
    if (this.dateOfBirth && !this.isModified('age')) {
        this.age = this.calculatedAge;
    }
    this.updatedAt = Date.now();
    next();
});

// Indexes (NO email index!)
donorSchema.index({ userId: 1 });
donorSchema.index({ "address.coordinates": "2dsphere" });
donorSchema.index({ "collegeDetails.collegeName": 1 });
donorSchema.index({ "collegeDetails.department": 1 });
donorSchema.index({ isAvailable: 1, isActive: 1 });
donorSchema.index({ nextEligibleDate: 1 });
donorSchema.index({ "collegeDetails.admissionNumber": 1 }, { unique: true, sparse: true });

// Update next eligible date after donation
donorSchema.methods.updateNextEligibleDate = function() {
    if (this.lastDonationDate) {
        const nextDate = new Date(this.lastDonationDate);
        nextDate.setDate(nextDate.getDate() + 90); // 90 days gap
        this.nextEligibleDate = nextDate;
    }
    return this.save();
};

// Check if donor is eligible
donorSchema.methods.isEligibleToDonate = function() {
    if (!this.isAvailable || !this.isActive) {
        return false;
    }
    
    // Age check
    if (this.age < 18 || this.age > 65) {
        return false;
    }
    
    // Weight check
    if (this.healthInfo?.weight && this.healthInfo.weight < 40) {
        return false;
    }
    
    // Hemoglobin check
    if (this.healthInfo?.hemoglobin && this.healthInfo.hemoglobin < 12.5) {
        return false;
    }
    
    // Eligibility date check
    if (this.nextEligibleDate && this.nextEligibleDate > new Date()) {
        return false;
    }
    
    return true;
};

// Get donor summary (with user data)
donorSchema.methods.getDonorSummary = async function() {
    await this.populate('user', 'name email phone bloodGroup');
    
    return {
        donorId: this._id,
        formattedId: this.formattedDonorId,
        name: this.user?.name || 'Unknown',
        bloodGroup: this.user?.bloodGroup || 'Unknown',
        email: this.user?.email,
        phone: this.user?.phone,
        age: this.calculatedAge,
        gender: this.gender,
        location: this.address?.city || this.collegeDetails?.district || 'Unknown',
        college: this.collegeDetails?.collegeName,
        department: this.collegeDetails?.department,
        totalDonations: this.totalDonations,
        totalUnits: this.totalUnitsDonated,
        lastDonationDate: this.lastDonationDate,
        nextEligibleDate: this.nextEligibleDate,
        isEligible: this.isEligibleToDonate(),
        isAvailable: this.isAvailable
    };
};

// Static method to find eligible donors by blood group
donorSchema.statics.findEligibleDonors = async function(bloodGroup, location = null, maxDistance = 50000) {
    // First find users with matching blood group
    const User = mongoose.model('User');
    const users = await User.find({ bloodGroup, role: 'donor' }).select('_id');
    const userIds = users.map(u => u._id);
    
    const query = {
        userId: { $in: userIds },
        isAvailable: true,
        isActive: true,
        nextEligibleDate: { $lte: new Date() }
    };
    
    if (location && location.coordinates && location.coordinates[0] !== 0 && location.coordinates[1] !== 0) {
        query['address.coordinates'] = {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: location.coordinates
                },
                $maxDistance: maxDistance
            }
        };
    }
    
    const donors = await this.find(query)
        .populate('user', 'name phone email bloodGroup')
        .sort({ lastDonationDate: -1, totalDonations: -1 })
        .limit(50);
    
    return donors.map(d => ({
        id: d._id,
        formattedId: d.formattedDonorId,
        name: d.user?.name,
        phone: d.user?.phone,
        email: d.user?.email,
        bloodGroup: d.user?.bloodGroup,
        location: d.address?.city || d.collegeDetails?.district || 'Unknown',
        college: d.collegeDetails?.collegeName,
        department: d.collegeDetails?.department,
        lastDonated: d.lastDonationDate,
        totalDonations: d.totalDonations,
        isEligible: d.isEligibleToDonate()
    }));
};

// Static method to get donor statistics
donorSchema.statics.getDonorStats = async function() {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                totalDonors: { $sum: 1 },
                activeDonors: { $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] } },
                verifiedDonors: { $sum: { $cond: [{ $eq: ["$isVerified", true] }, 1, 0] } },
                availableDonors: { $sum: { $cond: [{ $eq: ["$isAvailable", true] }, 1, 0] } },
                totalDonations: { $sum: "$totalDonations" },
                totalUnits: { $sum: "$totalUnitsDonated" },
                avgDonations: { $avg: "$totalDonations" }
            }
        },
        {
            $project: {
                _id: 0,
                totalDonors: 1,
                activeDonors: 1,
                verifiedDonors: 1,
                availableDonors: 1,
                totalDonations: 1,
                totalUnits: 1,
                avgDonations: { $round: ["$avgDonations", 2] }
            }
        }
    ]);
    
    return stats[0] || {
        totalDonors: 0,
        activeDonors: 0,
        verifiedDonors: 0,
        availableDonors: 0,
        totalDonations: 0,
        totalUnits: 0,
        avgDonations: 0
    };
};

// Static method to get donor count before a specific donor
donorSchema.statics.getCountBeforeDonor = async function(donorId) {
    const donor = await this.findById(donorId);
    if (!donor) return 0;
    
    return await this.countDocuments({
        createdAt: { $lt: donor.createdAt }
    });
};

module.exports = mongoose.model('Donor', donorSchema);