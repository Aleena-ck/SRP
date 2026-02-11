const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    // User reference
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    
    // Basic Information from second file
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Please enter your phone number'],
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    
    // Personal Details
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
    bloodGroup: {
        type: String,
        required: [true, 'Please select blood group'],
        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
    },
    
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
            trim: true
        },
        department: {
            type: String,
            required: [true, 'Please select department'],
            trim: true
        },
        yearOfStudy: String,
        university: String
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
    lastDonationDate: Date,
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
    
    // Emergency Contact (other than guardian)
    emergencyContacts: [{
        name: String,
        relationship: String,
        phone: String,
        isPrimary: Boolean
    }],
    
    // Documents
    documents: [{
        type: { type: String, enum: ['ID Proof', 'Medical Certificate', 'Other'] },
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        },
        verified: { type: Boolean, default: false }
    }],
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    
    // Status flags
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationNotes: String
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for full address
donorSchema.virtual('fullAddress').get(function() {
    const parts = [];
    if (this.address.street) parts.push(this.address.street);
    if (this.address.city) parts.push(this.address.city);
    if (this.address.district) parts.push(this.address.district);
    if (this.address.state) parts.push(this.address.state);
    if (this.address.pincode) parts.push(`- ${this.address.pincode}`);
    return parts.join(', ');
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

// Virtual for college details summary
donorSchema.virtual('collegeInfo').get(function() {
    const college = this.collegeDetails;
    if (!college || !college.collegeName) return '';
    
    const parts = [];
    parts.push(college.collegeName);
    if (college.department) parts.push(college.department);
    if (college.yearOfStudy) parts.push(`Year: ${college.yearOfStudy}`);
    if (college.university) parts.push(`University: ${college.university}`);
    
    return parts.join(' | ');
});

// Pre-save middleware to update age from dateOfBirth if available
donorSchema.pre('save', function(next) {
    if (this.dateOfBirth && !this.isModified('age')) {
        this.age = this.calculatedAge;
    }
    this.updatedAt = Date.now();
    next();
});

// Indexes
donorSchema.index({ "address.coordinates": "2dsphere" });
donorSchema.index({ "collegeDetails.collegeName": 1 });
donorSchema.index({ bloodGroup: 1, isAvailable: 1 });
donorSchema.index({ email: 1 }, { unique: true });
donorSchema.index({ "collegeDetails.admissionNumber": 1 }, { unique: true });
donorSchema.index({ phone: 1 });
donorSchema.index({ isActive: 1, isVerified: 1 });
donorSchema.index({ nextEligibleDate: 1 });

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
    if (!this.isAvailable || !this.isActive || !this.isVerified) {
        return false;
    }
    
    // Age check
    if (this.calculatedAge < 18 || this.calculatedAge > 65) {
        return false;
    }
    
    // Weight check
    if (!this.healthInfo.weight || this.healthInfo.weight < 40) {
        return false;
    }
    
    // Hemoglobin check
    if (!this.healthInfo.hemoglobin || this.healthInfo.hemoglobin < 12.5) {
        return false;
    }
    
    // Eligibility date check
    if (this.nextEligibleDate && this.nextEligibleDate > new Date()) {
        return false;
    }
    
    return true;
};

// Get donor summary
donorSchema.methods.getDonorSummary = function() {
    return {
        name: this.name,
        bloodGroup: this.bloodGroup,
        age: this.calculatedAge,
        location: this.address.city || this.collegeDetails.district,
        totalDonations: this.totalDonations,
        lastDonationDate: this.lastDonationDate,
        isEligible: this.isEligibleToDonate(),
        isAvailable: this.isAvailable
    };
};

// Static method to find eligible donors by blood group
donorSchema.statics.findEligibleDonors = function(bloodGroup, location = null, maxDistance = 50000) {
    const query = {
        bloodGroup: bloodGroup,
        isAvailable: true,
        isActive: true,
        isVerified: true,
        nextEligibleDate: { $lte: new Date() },
        'healthInfo.weight': { $gte: 40 },
        'healthInfo.hemoglobin': { $gte: 12.5 }
    };
    
    if (location && location.coordinates) {
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
    
    return this.find(query)
        .select('name bloodGroup phone email address collegeDetails lastDonationDate totalDonations')
        .sort({ lastDonationDate: -1, totalDonations: -1 })
        .limit(50);
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
        avgDonations: 0
    };
};

module.exports = mongoose.model('Donor', donorSchema);