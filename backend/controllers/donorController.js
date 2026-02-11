const Donor = require('../models/Donor');
const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const Donation = require('../models/Donation');

// @desc    Get all donors
// @route   GET /api/donors
// @access  Private/Admin
exports.getAllDonors = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            bloodGroup,
            department,
            college,
            city,
            isAvailable,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter
        const filter = {};
        if (bloodGroup && bloodGroup !== 'All') filter.bloodGroup = bloodGroup;
        if (department && department !== 'All') filter['collegeDetails.department'] = department;
        if (college && college !== 'All') filter['collegeDetails.collegeName'] = college;
        if (city && city !== 'All') filter['address.city'] = city;
        if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';

        // Build sort
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute query
        const donors = await Donor.find(filter)
            .populate('userId', 'name email phone bloodGroup')
            .sort(sort)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Donor.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: donors.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            donors
        });
    } catch (error) {
        console.error('Get all donors error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get donor by ID
// @route   GET /api/donors/:id
// @access  Private
exports.getDonorById = async (req, res) => {
    try {
        const donor = await Donor.findById(req.params.id)
            .populate('userId', 'name email phone bloodGroup role');

        if (!donor) {
            return res.status(404).json({
                success: false,
                message: 'Donor not found'
            });
        }

        // Check if user has permission
        if (req.user.role === 'donor' && donor.userId._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this donor'
            });
        }

        res.status(200).json({
            success: true,
            donor
        });
    } catch (error) {
        console.error('Get donor by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get donor profile (current user)
// @route   GET /api/donors/profile/me
// @access  Private/Donor
exports.getMyProfile = async (req, res) => {
    try {
        const donor = await Donor.findOne({ userId: req.user.id })
            .populate('userId', 'name email phone bloodGroup');

        if (!donor) {
            return res.status(404).json({
                success: false,
                message: 'Donor profile not found'
            });
        }

        res.status(200).json({
            success: true,
            donor
        });
    } catch (error) {
        console.error('Get my profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update donor profile
// @route   PUT /api/donors/profile
// @access  Private/Donor
exports.updateDonorProfile = async (req, res) => {
    try {
        const donor = await Donor.findOne({ userId: req.user.id });

        if (!donor) {
            return res.status(404).json({
                success: false,
                message: 'Donor profile not found'
            });
        }

        // Update donor fields
        const allowedUpdates = [
            'age', 'gender', 'guardianName', 'guardianPhone', 'guardianRelation',
            'collegeDetails', 'address', 'healthInfo', 'isAvailable',
            'availabilityRadius', 'preferredDonationType', 'contactPreferences',
            'emergencyContacts'
        ];

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                if (typeof req.body[field] === 'object' && !Array.isArray(req.body[field])) {
                    donor[field] = { ...donor[field], ...req.body[field] };
                } else {
                    donor[field] = req.body[field];
                }
            }
        });

        // Update user blood group if provided
        if (req.body.bloodGroup) {
            await User.findByIdAndUpdate(req.user.id, { bloodGroup: req.body.bloodGroup });
        }

        await donor.save();

        const updatedDonor = await Donor.findById(donor._id)
            .populate('userId', 'name email phone bloodGroup');

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            donor: updatedDonor
        });
    } catch (error) {
        console.error('Update donor profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Find donors by filters
// @route   GET /api/donors/find
// @access  Private
exports.findDonors = async (req, res) => {
    try {
        const {
            bloodGroup,
            department,
            college,
            city,
            lastDonatedAfter,
            sort = 'lastDonationDate',
            limit = 20
        } = req.query;

        // Build filter
        const filter = {
            isAvailable: true,
            'healthInfo.weight': { $gte: 40 },
            'healthInfo.hemoglobin': { $gte: 12.5 }
        };

        // Blood group filter
        if (bloodGroup && bloodGroup !== 'All') {
            // Find users with specific blood group
            const users = await User.find({ bloodGroup, role: 'donor' }).select('_id');
            const userIds = users.map(user => user._id);
            filter.userId = { $in: userIds };
        }

        // Other filters
        if (department && department !== 'All') {
            filter['collegeDetails.department'] = department;
        }
        if (college && college !== 'All') {
            filter['collegeDetails.collegeName'] = college;
        }
        if (city && city !== 'All') {
            filter['address.city'] = city;
        }
        if (lastDonatedAfter) {
            filter.lastDonationDate = { $lte: new Date(lastDonatedAfter) };
        }

        // Check eligibility (nextEligibleDate should be in past)
        filter.$or = [
            { nextEligibleDate: { $lte: new Date() } },
            { nextEligibleDate: { $exists: false } }
        ];

        // Build sort
        const sortOptions = {};
        if (sort === 'recent') {
            sortOptions.lastDonationDate = -1;
        } else if (sort === 'available') {
            sortOptions.nextEligibleDate = 1;
        } else {
            sortOptions.createdAt = -1;
        }

        // Execute query
        const donors = await Donor.find(filter)
            .populate('userId', 'name email phone bloodGroup')
            .sort(sortOptions)
            .limit(parseInt(limit));

        // Format response
        const formattedDonors = donors.map(donor => ({
            id: donor._id,
            name: donor.userId?.name || 'Unknown',
            bloodGroup: donor.userId?.bloodGroup || 'Not specified',
            department: donor.collegeDetails?.department || 'Not specified',
            college: donor.collegeDetails?.collegeName || 'Not specified',
            lastDonated: donor.lastDonationDate ? donor.lastDonationDate.toISOString().split('T')[0] : 'Never',
            contact: donor.userId?.phone || 'Not available',
            location: `${donor.address?.city || ''}, ${donor.address?.district || ''}`.trim(),
            isEligible: donor.isEligibleToDonate(),
            nextEligibleDate: donor.nextEligibleDate
        }));

        res.status(200).json({
            success: true,
            count: formattedDonors.length,
            donors: formattedDonors
        });
    } catch (error) {
        console.error('Find donors error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get donor donation history
// @route   GET /api/donors/donation-history
// @access  Private/Donor
exports.getDonationHistory = async (req, res) => {
    try {
        const donor = await Donor.findOne({ userId: req.user.id });
        if (!donor) {
            return res.status(404).json({
                success: false,
                message: 'Donor not found'
            });
        }

        const donations = await Donation.find({ donorId: donor._id })
            .populate('collectionCenter', 'organizationName location.city')
            .sort({ collectionDate: -1 })
            .limit(20);

        // Calculate next eligibility
        const nextEligibleDate = donor.nextEligibleDate || new Date();
        const isEligible = donor.isEligibleToDonate();

        res.status(200).json({
            success: true,
            donor: {
                name: req.user.name,
                donorId: donor._id,
                totalDonations: donor.totalDonations,
                totalUnitsDonated: donor.totalUnitsDonated,
                lastDonationDate: donor.lastDonationDate,
                nextEligibleDate,
                isEligible
            },
            donations: donations.map(donation => ({
                date: donation.collectionDate.toISOString().split('T')[0],
                type: donation.donationType,
                location: donation.collectionCenter?.organizationName || 'Unknown',
                centerLocation: donation.collectionCenter?.location?.city || '',
                units: donation.unitsCollected,
                status: donation.status,
                donationId: donation.donationId
            })),
            stats: {
                totalDonations: donor.totalDonations,
                totalUnits: donor.totalUnitsDonated,
                donationStreak: donor.donationStreak || 0,
                averageInterval: donor.averageDonationInterval || 0
            }
        });
    } catch (error) {
        console.error('Get donation history error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update donor availability
// @route   PUT /api/donors/availability
// @access  Private/Donor
exports.updateAvailability = async (req, res) => {
    try {
        const { isAvailable, availabilityRadius, preferredDonationType } = req.body;
        const donor = await Donor.findOne({ userId: req.user.id });

        if (!donor) {
            return res.status(404).json({
                success: false,
                message: 'Donor not found'
            });
        }

        if (isAvailable !== undefined) donor.isAvailable = isAvailable;
        if (availabilityRadius !== undefined) donor.availabilityRadius = availabilityRadius;
        if (preferredDonationType !== undefined) donor.preferredDonationType = preferredDonationType;

        await donor.save();

        res.status(200).json({
            success: true,
            message: 'Availability updated successfully',
            donor: {
                isAvailable: donor.isAvailable,
                availabilityRadius: donor.availabilityRadius,
                preferredDonationType: donor.preferredDonationType
            }
        });
    } catch (error) {
        console.error('Update availability error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get nearby donors
// @route   GET /api/donors/nearby
// @access  Private
exports.getNearbyDonors = async (req, res) => {
    try {
        const { latitude, longitude, maxDistance = 20, bloodGroup } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: 'Please provide latitude and longitude'
            });
        }

        const filter = {
            isAvailable: true,
            'address.coordinates': {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseInt(maxDistance) * 1000 // Convert km to meters
                }
            }
        };

        // Blood group filter
        if (bloodGroup && bloodGroup !== 'All') {
            const users = await User.find({ bloodGroup, role: 'donor' }).select('_id');
            const userIds = users.map(user => user._id);
            filter.userId = { $in: userIds };
        }

        const donors = await Donor.find(filter)
            .populate('userId', 'name phone bloodGroup')
            .limit(50);

        const formattedDonors = donors.map(donor => ({
            id: donor._id,
            name: donor.userId.name,
            bloodGroup: donor.userId.bloodGroup,
            phone: donor.userId.phone,
            distance: 'Nearby', // Could calculate actual distance
            lastDonated: donor.lastDonationDate ? 
                donor.lastDonationDate.toISOString().split('T')[0] : 'Never',
            isEligible: donor.isEligibleToDonate()
        }));

        res.status(200).json({
            success: true,
            count: formattedDonors.length,
            donors: formattedDonors
        });
    } catch (error) {
        console.error('Get nearby donors error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};