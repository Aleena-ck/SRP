const BloodRequest = require('../models/BloodRequest');
const Admin = require('../models/Admin');
const Donor = require('../models/Donor');
const BloodInventory = require('../models/BloodInventory');

// @desc    Create new blood request
// @route   POST /api/blood-requests
// @access  Private
exports.createBloodRequest = async (req, res) => {
    try {
        const {
            patientName,
            patientAge,
            patientGender,
            bloodGroup,
            requiredUnits,
            componentType,
            hospitalName,
            location,
            contactPerson,
            reason,
            reasonDetails,
            priority,
            neededBy,
            notes
        } = req.body;

        // Check if user is admin or donor
        let hospitalId = null;
        if (req.user.role === 'admin') {
            const admin = await Admin.findOne({ userId: req.user.id });
            if (admin) {
                hospitalId = admin._id;
                hospitalName = admin.organizationName;
            }
        }

        const request = await BloodRequest.create({
            patientName,
            patientAge,
            patientGender,
            bloodGroup,
            requiredUnits,
            componentType: componentType || 'Whole Blood',
            hospitalName,
            hospitalId,
            location,
            contactPerson: contactPerson || {
                name: req.user.name,
                phone: req.user.phone,
                relationship: 'Self'
            },
            reason,
            reasonDetails,
            priority: priority || 'Normal',
            neededBy: neededBy || new Date(Date.now() + 24 * 60 * 60 * 1000), // Default: tomorrow
            requestedBy: req.user.id,
            status: 'Pending',
            statusHistory: [{
                status: 'Pending',
                changedBy: req.user.id,
                notes: 'Request created'
            }]
        });

        res.status(201).json({
            success: true,
            message: 'Blood request created successfully',
            request
        });
    } catch (error) {
        console.error('Create blood request error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get all blood requests
// @route   GET /api/blood-requests
// @access  Private
exports.getAllBloodRequests = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            bloodGroup,
            priority,
            hospitalId,
            requestedBy,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter based on user role
        const filter = {};
        
        if (req.user.role === 'admin') {
            const admin = await Admin.findOne({ userId: req.user.id });
            if (admin) {
                filter.hospitalId = admin._id;
            }
        } else if (req.user.role === 'donor') {
            filter.requestedBy = req.user.id;
        }

        // Additional filters
        if (status && status !== 'All') filter.status = status;
        if (bloodGroup && bloodGroup !== 'All') filter.bloodGroup = bloodGroup;
        if (priority && priority !== 'All') filter.priority = priority;
        if (hospitalId) filter.hospitalId = hospitalId;
        if (requestedBy) filter.requestedBy = requestedBy;

        // Build sort
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute query
        const requests = await BloodRequest.find(filter)
            .populate('requestedBy', 'name email phone')
            .populate('hospitalId', 'organizationName location.city')
            .sort(sort)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await BloodRequest.countDocuments(filter);

        // Format response for frontend
        const formattedRequests = requests.map(request => ({
            requestId: request.requestId,
            patientName: request.patientName,
            bloodGroup: request.bloodGroup,
            quantity: request.requiredUnits,
            fulfilled: request.fulfilledUnits,
            remaining: request.requiredUnits - request.fulfilledUnits,
            hospital: request.hospitalName,
            location: `${request.location?.city || ''}`,
            priority: request.priority,
            status: request.status,
            neededBy: request.neededBy,
            createdAt: request.createdAt,
            contact: request.contactPerson?.phone,
            reason: request.reason
        }));

        res.status(200).json({
            success: true,
            count: requests.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            requests: formattedRequests
        });
    } catch (error) {
        console.error('Get all blood requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get single blood request
// @route   GET /api/blood-requests/:id
// @access  Private
exports.getBloodRequest = async (req, res) => {
    try {
        const request = await BloodRequest.findById(req.params.id)
            .populate('requestedBy', 'name email phone')
            .populate('hospitalId', 'organizationName location contactInfo')
            .populate('donors.donorId', 'userId')
            .populate('donors.donorId.userId', 'name phone bloodGroup');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Blood request not found'
            });
        }

        // Check permissions
        if (req.user.role === 'donor' && request.requestedBy._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this request'
            });
        }

        res.status(200).json({
            success: true,
            request
        });
    } catch (error) {
        console.error('Get blood request error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update blood request status
// @route   PUT /api/blood-requests/:id/status
// @access  Private/Admin
exports.updateRequestStatus = async (req, res) => {
    try {
        const { status, notes } = req.body;
        
        const request = await BloodRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Blood request not found'
            });
        }

        // Check if admin has permission
        const admin = await Admin.findOne({ userId: req.user.id });
        if (!admin || request.hospitalId.toString() !== admin._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this request'
            });
        }

        await request.updateStatus(status, req.user.id, notes);

        res.status(200).json({
            success: true,
            message: `Request status updated to ${status}`,
            request
        });
    } catch (error) {
        console.error('Update request status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Assign donor to request
// @route   POST /api/blood-requests/:id/assign-donor
// @access  Private/Admin
exports.assignDonorToRequest = async (req, res) => {
    try {
        const { donorId, unitsDonated } = req.body;
        
        const request = await BloodRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Blood request not found'
            });
        }

        // Check if request is still open
        if (request.status === 'Completed' || request.status === 'Cancelled') {
            return res.status(400).json({
                success: false,
                message: `Cannot assign donor to ${request.status} request`
            });
        }

        // Check if donor exists
        const donor = await Donor.findById(donorId);
        if (!donor) {
            return res.status(404).json({
                success: false,
                message: 'Donor not found'
            });
        }

        // Check if donor is eligible
        if (!donor.isEligibleToDonate()) {
            return res.status(400).json({
                success: false,
                message: 'Donor is not eligible to donate'
            });
        }

        // Add donor to request
        request.donors.push({
            donorId: donor._id,
            unitsDonated: unitsDonated || 1,
            donationDate: new Date()
        });

        // Update fulfilled units
        request.fulfilledUnits += unitsDonated || 1;

        // Check if request is completed
        if (request.fulfilledUnits >= request.requiredUnits) {
            await request.updateStatus('Completed', req.user.id, 'All units fulfilled');
        } else {
            await request.updateStatus('Processing', req.user.id, 'Donor assigned');
        }

        // Update donor's last donation date
        donor.lastDonationDate = new Date();
        await donor.updateNextEligibleDate();
        await donor.save();

        res.status(200).json({
            success: true,
            message: 'Donor assigned successfully',
            request
        });
    } catch (error) {
        console.error('Assign donor error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get emergency requests
// @route   GET /api/blood-requests/emergency
// @access  Public
exports.getEmergencyRequests = async (req, res) => {
    try {
        const emergencyRequests = await BloodRequest.find({
            priority: 'Emergency',
            status: { $in: ['Pending', 'Approved', 'Processing'] },
            neededBy: { $gte: new Date() } // Not expired
        })
        .populate('hospitalId', 'organizationName location.city')
        .sort({ neededBy: 1 })
        .limit(10);

        const formattedRequests = emergencyRequests.map(request => ({
            patient: request.patientName,
            bloodGroup: request.bloodGroup,
            hospital: request.hospitalName,
            reason: request.reason,
            neededBy: request.neededBy.toLocaleString('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            }),
            contact: request.contactPerson?.phone,
            unitsNeeded: request.requiredUnits - request.fulfilledUnits,
            requestId: request.requestId
        }));

        res.status(200).json({
            success: true,
            count: emergencyRequests.length,
            requests: formattedRequests
        });
    } catch (error) {
        console.error('Get emergency requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Cancel blood request
// @route   PUT /api/blood-requests/:id/cancel
// @access  Private
exports.cancelBloodRequest = async (req, res) => {
    try {
        const request = await BloodRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Blood request not found'
            });
        }

        // Check permissions
        if (req.user.role === 'donor' && request.requestedBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this request'
            });
        }

        if (req.user.role === 'admin') {
            const admin = await Admin.findOne({ userId: req.user.id });
            if (!admin || request.hospitalId.toString() !== admin._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to cancel this request'
                });
            }
        }

        await request.updateStatus('Cancelled', req.user.id, 'Request cancelled by user');

        res.status(200).json({
            success: true,
            message: 'Blood request cancelled successfully'
        });
    } catch (error) {
        console.error('Cancel blood request error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get my blood requests (for donor)
// @route   GET /api/blood-requests/my-requests
// @access  Private/Donor
exports.getMyBloodRequests = async (req, res) => {
    try {
        const requests = await BloodRequest.find({ requestedBy: req.user.id })
            .populate('hospitalId', 'organizationName location.city')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
            requests: requests.map(request => ({
                requestId: request.requestId,
                patientName: request.patientName,
                bloodGroup: request.bloodGroup,
                requiredUnits: request.requiredUnits,
                fulfilledUnits: request.fulfilledUnits,
                hospital: request.hospitalName,
                status: request.status,
                neededBy: request.neededBy,
                createdAt: request.createdAt,
                priority: request.priority
            }))
        });
    } catch (error) {
        console.error('Get my blood requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};