const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    // Donation Identification
    donationId: {
        type: String,
        unique: true,
        required: true,
        uppercase: true,
        match: [/^DON\d{6}$/, 'Invalid donation ID format']
    },
    
    // Donor Information
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor',
        required: true
    },
    donorUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Collection Details
    collectionCenter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    collectionDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    collectionTime: String,
    
    // Donation Details
    donationType: {
        type: String,
        enum: ['Whole Blood', 'Platelets', 'Plasma', 'Double Red Cells', 'Auto Donation'],
        required: true,
        default: 'Whole Blood'
    },
    unitsCollected: {
        type: Number,
        required: true,
        min: 0.5,
        max: 2,
        default: 1
    },
    bloodGroup: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    
    // Health Screening
    preDonationScreening: {
        weight: Number,
        hemoglobin: Number,
        bloodPressure: String,
        pulseRate: Number,
        temperature: Number,
        conductedBy: String
    },
    
    // Post-Donation Details
    postDonation: {
        recoveryTime: Number, // in minutes
        refreshmentsProvided: Boolean,
        anyAdverseReaction: Boolean,
        reactionDetails: String,
        dischargedAt: Date
    },
    
    // Test Results
    testResults: {
        hiv: { type: Boolean, default: false },
        hepatitisB: { type: Boolean, default: false },
        hepatitisC: { type: Boolean, default: false },
        syphilis: { type: Boolean, default: false },
        malaria: { type: Boolean, default: false },
        bloodGroupConfirmed: { type: Boolean, default: false },
        testedAt: Date,
        testedBy: String
    },
    
    // Storage Information
    storageDetails: {
        bagNumber: String,
        batchNumber: String,
        storageLocation: String,
        storageTemperature: String,
        componentSeparated: Boolean,
        components: [{
            type: String,
            quantity: Number,
            storedIn: String
        }]
    },
    
    // Status
    status: {
        type: String,
        enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Deferred', 'Tested', 'Available', 'Transfused', 'Discarded'],
        default: 'Completed'
    },
    
    // Request Reference (if donation for specific request)
    requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BloodRequest'
    },
    
    // Staff Information
    collectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    doctorOnDuty: String,
    nurseOnDuty: String,
    
    // Feedback
    donorFeedback: {
        rating: { type: Number, min: 1, max: 5 },
        comments: String,
        wouldDonateAgain: Boolean,
        submittedAt: Date
    },
    
    // Inventory Reference
    inventoryItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BloodInventory'
    }],
    
    // Next Donation Eligibility
    nextEligibleDate: Date,
    deferralReason: String,
    deferralPeriod: Number, // in days
    
    // Documents
    documents: [{
        type: { type: String, enum: ['Donation Certificate', 'Test Report', 'Receipt', 'Other'] },
        url: String,
        uploadedAt: Date
    }],
    
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

// Generate donation ID before saving
donationSchema.pre('save', async function(next) {
    if (!this.donationId) {
        const lastDonation = await this.constructor.findOne().sort({ createdAt: -1 });
        const lastNumber = lastDonation ? parseInt(lastDonation.donationId.replace('DON', '')) : 0;
        this.donationId = 'DON' + String(lastNumber + 1).padStart(6, '0');
    }
    next();
});

// Virtual for donor details
donationSchema.virtual('donorDetails', {
    ref: 'Donor',
    localField: 'donorId',
    foreignField: '_id',
    justOne: true
});

// Virtual for center details
donationSchema.virtual('centerDetails', {
    ref: 'Admin',
    localField: 'collectionCenter',
    foreignField: '_id',
    justOne: true
});

// Virtual for days since donation
donationSchema.virtual('daysSinceDonation').get(function() {
    const now = new Date();
    const donationDate = new Date(this.collectionDate);
    const diffTime = now - donationDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for donation interval (for repeat donors)
donationSchema.statics.getDonationInterval = async function(donorId) {
    const donations = await this.find({ donorId })
        .sort({ collectionDate: -1 })
        .limit(2);
    
    if (donations.length < 2) return null;
    
    const lastDonation = new Date(donations[0].collectionDate);
    const previousDonation = new Date(donations[1].collectionDate);
    return Math.floor((lastDonation - previousDonation) / (1000 * 60 * 60 * 24));
};

// Update donor's next eligible date
donationSchema.post('save', async function() {
    if (this.status === 'Completed') {
        const Donor = require('./Donor');
        const donor = await Donor.findById(this.donorId);
        
        if (donor) {
            donor.lastDonationDate = this.collectionDate;
            donor.totalDonations += 1;
            donor.totalUnitsDonated += this.unitsCollected;
             await donor.updateNextEligibleDate();
            
            // Update donation streak
            const lastDonation = new Date(this.collectionDate);
            const previousDonationDate = donor.lastDonationDate ? new Date(donor.lastDonationDate) : null;
            
            if (previousDonationDate) {
                const daysBetween = Math.floor((lastDonation - previousDonationDate) / (1000 * 60 * 60 * 24));
                if (daysBetween <= 120) { // Within 4 months
                    donor.donationStreak += 1;
                } else {
                    donor.donationStreak = 1;
                }
            } else {
                donor.donationStreak = 1;
            }
            
            await donor.save();
        }
    }
});

// Check if donation can be cancelled
donationSchema.methods.canCancel = function() {
    return ['Scheduled', 'In Progress'].includes(this.status);
};

// Method to get donation summary
donationSchema.methods.getSummary = function() {
    return {
        donationId: this.donationId,
        donorId: this.donorId,
        collectionDate: this.collectionDate,
        donationType: this.donationType,
        bloodGroup: this.bloodGroup,
        unitsCollected: this.unitsCollected,
        status: this.status,
        daysSinceDonation: this.daysSinceDonation,
        nextEligibleDate: this.nextEligibleDate
    };
};

// Static method to get donations by date range
donationSchema.statics.getDonationsByDateRange = async function(startDate, endDate, options = {}) {
    const query = {
        collectionDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        }
    };
    
    // Add optional filters
    if (options.bloodGroup) {
        query.bloodGroup = options.bloodGroup;
    }
    if (options.donationType) {
        query.donationType = options.donationType;
    }
    if (options.status) {
        query.status = options.status;
    }
    if (options.collectionCenter) {
        query.collectionCenter = options.collectionCenter;
    }
    
    return await this.find(query)
        .populate('donorId', 'name bloodGroup phone email')
        .populate('collectionCenter', 'name centerName email phone')
        .sort({ collectionDate: -1 });
};

// Static method to get donation statistics
donationSchema.statics.getDonationStats = async function() {
    const stats = await this.aggregate([
        {
            $match: { status: 'Completed' }
        },
        {
            $group: {
                _id: null,
                totalDonations: { $sum: 1 },
                totalUnits: { $sum: "$unitsCollected" },
                avgUnits: { $avg: "$unitsCollected" },
                byBloodGroup: {
                    $push: {
                        bloodGroup: "$bloodGroup",
                        units: "$unitsCollected"
                    }
                },
                byDonationType: {
                    $push: {
                        type: "$donationType",
                        count: 1
                    }
                },
                byMonth: {
                    $push: {
                        month: { $month: "$collectionDate" },
                        year: { $year: "$collectionDate" },
                        count: 1
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                totalDonations: 1,
                totalUnits: 1,
                avgUnits: { $round: ["$avgUnits", 2] },
                bloodGroupBreakdown: {
                    $arrayToObject: {
                        $map: {
                            input: {
                                $reduce: {
                                    input: "$byBloodGroup",
                                    initialValue: [],
                                    in: {
                                        $concatArrays: [
                                            "$$value",
                                            [
                                                {
                                                    k: "$$this.bloodGroup",
                                                    v: {
                                                        $cond: {
                                                            if: { $eq: ["$$this.bloodGroup", "$$this.bloodGroup"] },
                                                            then: {
                                                                $sum: ["$$this.units", { $arrayElemAt: ["$$value.v", 0] } || 0]
                                                            },
                                                            else: "$$this.units"
                                                        }
                                                    }
                                                }
                                            ]
                                        ]
                                    }
                                }
                            },
                            as: "item",
                            in: ["$$item.k", "$$item.v"]
                        }
                    }
                },
                donationTypeBreakdown: {
                    $arrayToObject: {
                        $map: {
                            input: {
                                $reduce: {
                                    input: "$byDonationType",
                                    initialValue: [],
                                    in: {
                                        $concatArrays: [
                                            "$$value",
                                            [
                                                {
                                                    k: "$$this.type",
                                                    v: {
                                                        $cond: {
                                                            if: { $eq: ["$$this.type", "$$this.type"] },
                                                            then: {
                                                                $sum: [1, { $arrayElemAt: ["$$value.v", 0] } || 0]
                                                            },
                                                            else: 1
                                                        }
                                                    }
                                                }
                                            ]
                                        ]
                                    }
                                }
                            },
                            as: "item",
                            in: ["$$item.k", "$$item.v"]
                        }
                    }
                },
                monthlyStats: {
                    $map: {
                        input: {
                            $slice: [{
                                $sortArray: {
                                    input: "$byMonth",
                                    sortBy: { year: -1, month: -1 }
                                }
                            }, 6] // Last 6 months
                        },
                        as: "monthData",
                        in: {
                            month: "$$monthData.month",
                            year: "$$monthData.year",
                            count: "$$monthData.count"
                        }
                    }
                }
            }
        }
    ]);
    
    return stats[0] || {
        totalDonations: 0,
        totalUnits: 0,
        avgUnits: 0,
        bloodGroupBreakdown: {},
        donationTypeBreakdown: {},
        monthlyStats: []
    };
};

// Static method to find available donations for a specific blood request
donationSchema.statics.findAvailableForRequest = async function(bloodGroup, requestDate, quantity = 1) {
    return await this.find({
        bloodGroup: bloodGroup,
        status: 'Available',
        collectionDate: { $lte: new Date(requestDate) },
        testResults: {
            $and: [
                { hiv: false },
                { hepatitisB: false },
                { hepatitisC: false },
                { syphilis: false },
                { malaria: false },
                { bloodGroupConfirmed: true }
            ]
        },
        'storageDetails.componentSeparated': false // Assuming whole blood units
    })
    .sort({ collectionDate: 1 }) // FIFO - oldest first
    .limit(quantity)
    .populate('donorId', 'name bloodGroup')
    .populate('collectionCenter', 'name centerName location');
};

// Method to mark donation as transfused
donationSchema.methods.markAsTransfused = async function(patientInfo, transfusedBy) {
    this.status = 'Transfused';
    this.transfusionDetails = {
        patientInfo: patientInfo,
        transfusedBy: transfusedBy,
        transfusedAt: new Date()
    };
    return await this.save();
};

// Indexes for better query performance
donationSchema.index({ donationId: 1 }, { unique: true });
donationSchema.index({ donorId: 1, collectionDate: -1 });
donationSchema.index({ bloodGroup: 1, status: 1, collectionDate: -1 });
donationSchema.index({ collectionCenter: 1, collectionDate: -1 });
donationSchema.index({ collectionDate: -1 });
donationSchema.index({ status: 1, nextEligibleDate: 1 });
donationSchema.index({ "testResults.bloodGroupConfirmed": 1 });

module.exports = mongoose.model('Donation', donationSchema);         