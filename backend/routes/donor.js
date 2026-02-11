const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getAllDonors,
    getDonorById,
    getMyProfile,
    updateDonorProfile,
    findDonors,
    getDonationHistory,
    updateAvailability,
    getNearbyDonors
} = require('../controllers/donorController');

// All routes are protected
router.use(protect);

// Test route - ADD THIS
router.get('/test', (req, res) => {
    res.json({ 
        success: true,
        message: 'Donor API is working!',
        endpoints: {
            findDonors: 'GET /api/donors/find',
            nearbyDonors: 'GET /api/donors/nearby',
            myProfile: 'GET /api/donors/profile/me (protected, donor only)',
            updateProfile: 'PUT /api/donors/profile (protected, donor only)',
            donationHistory: 'GET /api/donors/donation-history (protected, donor only)'
        }
    });
});

// Admin only routes
router.get('/', authorize('admin'), getAllDonors);
router.get('/:id', getDonorById);

// Donor only routes
router.get('/profile/me', authorize('donor'), getMyProfile);
router.put('/profile', authorize('donor'), updateDonorProfile);
router.get('/donation-history', authorize('donor'), getDonationHistory);
router.put('/availability', authorize('donor'), updateAvailability);

// Public access (but requires authentication)
router.get('/find/donors', findDonors);
router.get('/nearby', getNearbyDonors);

module.exports = router;