const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
    recordDonation,
    getAllDonations,
    getDonationById,
    getDonorDonationHistory,
    updateTestResults,
    getDonationStats
} = require('../controllers/donationController');

// Validation middleware
const donationValidation = [
    body('donorId').isMongoId().withMessage('Valid donor ID is required'),
    body('donationType').isIn(['Whole Blood', 'Platelets', 'Plasma', 'Double Red Cells', 'Auto Donation']),
    body('unitsCollected').isFloat({ min: 0.5, max: 2 }).withMessage('Units must be between 0.5 and 2'),
    body('bloodGroup').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    body('preDonationScreening.hemoglobin').optional().isFloat({ min: 12.5 }).withMessage('Hemoglobin must be at least 12.5'),
    body('preDonationScreening.weight').optional().isFloat({ min: 40 }).withMessage('Weight must be at least 40kg')
];

// All routes are protected
router.use(protect);

// Admin only routes
router.post('/', authorize('admin'), donationValidation, recordDonation);
router.get('/', authorize('admin'), getAllDonations);
router.get('/stats', authorize('admin'), getDonationStats);
router.put('/:id/test-results', authorize('admin'), updateTestResults);

// Shared routes (both admin and donor can access based on permissions)
router.get('/:id', getDonationById);

// Donor only routes
router.get('/donor/history', authorize('donor'), getDonorDonationHistory);

module.exports = router;