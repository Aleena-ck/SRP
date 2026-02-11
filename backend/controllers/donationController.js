const Donation = require('../models/Donation');
const Donor = require('../models/Donor');
const Admin = require('../models/Admin');
const BloodInventory = require('../models/BloodInventory');

// @desc    Record new donation
// @route   POST /api/donations
// @access  Private/Admin
exports.recordDonation = async (req, res) => {
    try {
        const admin = await Admin.findOne({ userId: req.user.id });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin profile not found'
            });
        }

        const {
            donorId,
            donationType,
            unitsCollected,
            bloodGroup,
            preDonationScreening,
            postDonation,
            requestId,
            notes
        } = req.body;

        // Get donor info
        const donor = await Donor.findById(donorId)
            .populate('userId', 'name email phone bloodGroup');
        
        if (!donor) {
            return res.status(404).json({
                success: false,
                message: 'Donor not found'
            });
        }

        // Check donor eligibility
        if (!donor.isEligibleToDonate()) {
            return res.status(400).json({
                success: false,
                message: 'Donor is not eligible to donate',
                reasons: {
                    isAvailable: donor.isAvailable,
                    weight: donor.healthInfo?.weight >= 40,
                    hemoglobin: donor.healthInfo?.hemoglobin >= 12.5,
                    lastDonation: donor.nextEligibleDate <= new Date()
                }
            });
        }

        // Create donation record
        const donation = await Donation.create({
            donorId: donor._id,
            donorUserId: donor.userId._id,
            collectionCenter: admin._id,
            donationType: donationType || 'Whole Blood',
            unitsCollected: unitsCollected || 1,
            bloodGroup: bloodGroup || donor.userId.bloodGroup,
            preDonationScreening,
            postDonation,
            requestId,
            collectedBy: req.user.id,
            status: 'Completed',
            nextEligibleDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
        });

        // Update donor's last donation and eligibility
        donor.lastDonationDate = donation.collectionDate;
        donor.totalDonations += 1;
        donor.totalUnitsDonated += donation.unitsCollected;
        donor.nextEligibleDate = donation.nextEligibleDate;
        await donor.save();

        // Create inventory item from donation
        const inventoryItem = await BloodInventory.create({
            adminId: admin._id,
            bloodGroup: donation.bloodGroup,
            componentType: donation.donationType === 'Whole Blood' ? 'Packed RBC' : donation.donationType,
            availableUnits: donation.unitsCollected,
            reservedUnits: 0,
            totalUnits: donation.unitsCollected,
            collectionDate: donation.collectionDate,
            expiryDate: new Date(donation.collectionDate.getTime() + 35 * 24 * 60 * 60 * 1000), // 35 days
            donorId: donor._id,
            donationId: donation._id,
            storageTemperature: 'Refrigerated (2-6°C)',
            status: 'Available'
        });

        // Link inventory item to donation
        donation.inventoryItems.push(inventoryItem._id);
        await donation.save();

        // Update admin stats
        admin.stats.totalCollections = (admin.stats.totalCollections || 0) + 1;
        await admin.save();

        res.status(201).json({
            success: true,
            message: 'Donation recorded successfully',
            donation,
            inventoryItem,
            donor: {
                name: donor.userId.name,
                nextEligibleDate: donor.nextEligibleDate
            }
        });
    } catch (error) {
        console.error('Record donation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get all donations
// @route   GET /api/donations
// @access  Private/Admin
exports.getAllDonations = async (req, res) => {
    try {
        const admin = await Admin.findOne({ userId: req.user.id });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin profile not found'
            });
        }

        const {
            page = 1,
            limit = 10,
            bloodGroup,
            donationType,
            startDate,
            endDate,
            status
        } = req.query;

        const filter = { collectionCenter: admin._id };
        
        if (bloodGroup && bloodGroup !== 'All') filter.bloodGroup = bloodGroup;
        if (donationType && donationType !== 'All') filter.donationType = donationType;
        if (status && status !== 'All') filter.status = status;
        
        if (startDate || endDate) {
            filter.collectionDate = {};
            if (startDate) filter.collectionDate.$gte = new Date(startDate);
            if (endDate) filter.collectionDate.$lte = new Date(endDate);
        }

        const donations = await Donation.find(filter)
            .populate('donorId', 'userId')
            .populate('donorId.userId', 'name phone')
            .sort({ collectionDate: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Donation.countDocuments(filter);

        const formattedDonations = donations.map(donation => ({
            donationId: donation.donationId,
            donorName: donation.donorId?.userId?.name || 'Anonymous',
            donorPhone: donation.donorId?.userId?.phone,
            bloodGroup: donation.bloodGroup,
            donationType: donation.donationType,
            unitsCollected: donation.unitsCollected,
            collectionDate: donation.collectionDate,
            status: donation.status,
            preDonationScreening: donation.preDonationScreening,
            testResults: donation.testResults
        }));

        res.status(200).json({
            success: true,
            count: donations.length,
            total,
            donations: formattedDonations
        });
    } catch (error) {
        console.error('Get all donations error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get donation by ID
// @route   GET /api/donations/:id
// @access  Private
exports.getDonationById = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id)
            .populate('donorId', 'userId')
            .populate('donorId.userId', 'name email phone')
            .populate('collectionCenter', 'organizationName location')
            .populate('inventoryItems');

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found'
            });
        }

        // Check permissions
        const admin = await Admin.findOne({ userId: req.user.id });
        if (req.user.role === 'admin' && admin && 
            donation.collectionCenter._id.toString() !== admin._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this donation'
            });
        }

        if (req.user.role === 'donor' && donation.donorUserId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this donation'
            });
        }

        res.status(200).json({
            success: true,
            donation
        });
    } catch (error) {
        console.error('Get donation by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get donor's donation history
// @route   GET /api/donations/donor/history
// @access  Private/Donor
exports.getDonorDonationHistory = async (req, res) => {
    try {
        const donor = await Donor.findOne({ userId: req.user.id });
        if (!donor) {
            return res.status(404).json({
                success: false,
                message: 'Donor profile not found'
            });
        }

        const donations = await Donation.find({ donorId: donor._id })
            .populate('collectionCenter', 'organizationName location.city')
            .sort({ collectionDate: -1 });

        const donationHistory = donations.map(donation => ({
            date: donation.collectionDate.toISOString().split('T')[0],
            type: donation.donationType,
            location: donation.collectionCenter?.organizationName || 'Unknown',
            centerLocation: donation.collectionCenter?.location?.city || '',
            status: donation.status,
            units: donation.unitsCollected,
            donationId: donation.donationId
        }));

        // Calculate stats
        const stats = {
            totalDonations: donor.totalDonations,
            totalUnits: donor.totalUnitsDonated,
            lastDonation: donor.lastDonationDate,
            nextEligible: donor.nextEligibleDate,
            isEligible: donor.isEligibleToDonate()
        };

        res.status(200).json({
            success: true,
            donor: {
                name: req.user.name,
                donorId: donor._id,
                bloodGroup: req.user.bloodGroup
            },
            history: donationHistory,
            stats
        });
    } catch (error) {
        console.error('Get donor donation history error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update donation test results
// @route   PUT /api/donations/:id/test-results
// @access  Private/Admin
exports.updateTestResults = async (req, res) => {
    try {
        const admin = await Admin.findOne({ userId: req.user.id });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin profile not found'
            });
        }

        const donation = await Donation.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found'
            });
        }

        // Check if donation belongs to admin's center
        if (donation.collectionCenter.toString() !== admin._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this donation'
            });
        }

        const { testResults } = req.body;

        // Update test results
        donation.testResults = {
            ...donation.testResults,
            ...testResults,
            testedAt: new Date(),
            testedBy: req.user.id
        };

        // Update donation status
        if (testResults) {
            const allTestsPassed = !(
                testResults.hiv || 
                testResults.hepatitisB || 
                testResults.hepatitisC || 
                testResults.syphilis || 
                testResults.malaria
            );

            if (allTestsPassed) {
                donation.status = 'Tested';
                
                // Update inventory status
                if (donation.inventoryItems && donation.inventoryItems.length > 0) {
                    await BloodInventory.updateMany(
                        { _id: { $in: donation.inventoryItems } },
                        { 
                            tested: true,
                            testResults: donation.testResults,
                            status: 'Available'
                        }
                    );
                }
            } else {
                donation.status = 'Discarded';
                
                // Discard inventory items
                if (donation.inventoryItems && donation.inventoryItems.length > 0) {
                    await BloodInventory.updateMany(
                        { _id: { $in: donation.inventoryItems } },
                        { 
                            tested: true,
                            testResults: donation.testResults,
                            status: 'Discarded',
                            availableUnits: 0
                        }
                    );
                }
            }
        }

        await donation.save();

        res.status(200).json({
            success: true,
            message: 'Test results updated successfully',
            donation
        });
    } catch (error) {
        console.error('Update test results error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get donation statistics
// @route   GET /api/donations/stats
// @access  Private/Admin
exports.getDonationStats = async (req, res) => {
    try {
        const admin = await Admin.findOne({ userId: req.user.id });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin profile not found'
            });
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Get donations in last 30 days
        const recentDonations = await Donation.aggregate([
            {
                $match: {
                    collectionCenter: admin._id,
                    collectionDate: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$collectionDate" }
                    },
                    count: { $sum: 1 },
                    totalUnits: { $sum: "$unitsCollected" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get donations by blood group
        const byBloodGroup = await Donation.aggregate([
            {
                $match: {
                    collectionCenter: admin._id,
                    collectionDate: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: "$bloodGroup",
                    count: { $sum: 1 },
                    totalUnits: { $sum: "$unitsCollected" }
                }
            }
        ]);

        // Get donations by type
        const byDonationType = await Donation.aggregate([
            {
                $match: {
                    collectionCenter: admin._id,
                    collectionDate: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: "$donationType",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get top donors
        const topDonors = await Donation.aggregate([
            {
                $match: {
                    collectionCenter: admin._id,
                    collectionDate: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: "$donorId",
                    donationCount: { $sum: 1 },
                    totalUnits: { $sum: "$unitsCollected" }
                }
            },
            { $sort: { donationCount: -1 } },
            { $limit: 5 }
        ]);

        // Populate donor names
        for (let donor of topDonors) {
            const donorDoc = await Donor.findById(donor._id)
                .populate('userId', 'name');
            donor.name = donorDoc?.userId?.name || 'Anonymous';
        }

        res.status(200).json({
            success: true,
            stats: {
                recentDonations,
                byBloodGroup,
                byDonationType,
                topDonors,
                summary: {
                    totalDonations30Days: recentDonations.reduce((sum, day) => sum + day.count, 0),
                    totalUnits30Days: recentDonations.reduce((sum, day) => sum + day.totalUnits, 0),
                    uniqueBloodGroups: byBloodGroup.length,
                    mostCommonBloodGroup: byBloodGroup.length > 0 ? 
                        byBloodGroup.reduce((max, curr) => curr.count > max.count ? curr : max, byBloodGroup[0])._id : null
                }
            }
        });
    } catch (error) {
        console.error('Get donation stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};