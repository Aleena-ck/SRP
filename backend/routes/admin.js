const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getDashboardStats,
    getAllCenters,
    updateAdminProfile,
    verifyAdminCenter,
    getCenterDetails,
    searchBlood
} = require('../controllers/adminController');

// Test route - ADD THIS
router.get('/test', (req, res) => {
    res.json({ 
        success: true,
        message: 'Admin API is working!',
        endpoints: {
            getAllCenters: 'GET /api/admin/centers',
            getCenterDetails: 'GET /api/admin/center/:id',
            searchBlood: 'GET /api/admin/search-blood',
            dashboard: 'GET /api/admin/dashboard (protected, admin only)'
        }
    });
});

// Public routes
router.get('/centers', getAllCenters);
router.get('/center/:id', getCenterDetails);
router.get('/search-blood', searchBlood);

// Admin only routes (protected)
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.put('/profile', updateAdminProfile);

// Super admin only routes
router.put('/verify/:id', authorize('admin'), verifyAdminCenter);

module.exports = router;