const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
    getInventory,
    addToInventory,
    updateInventoryItem,
    deleteInventoryItem,
    searchBlood,
    getInventoryAlerts
} = require('../controllers/inventoryController');

// Validation middleware
const inventoryValidation = [
    body('bloodGroup').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Valid blood group is required'),
    body('availableUnits').isInt({ min: 0 }).withMessage('Available units must be a positive number'),
    body('collectionDate').isISO8601().withMessage('Valid collection date is required'),
    body('expiryDate').isISO8601().withMessage('Valid expiry date is required'),
    body('componentType').optional().isIn(['Whole Blood', 'Packed RBC', 'Platelets', 'Plasma', 'Cryoprecipitate'])
];

// Public routes
router.get('/search', searchBlood);

// Admin only routes (protected)
router.use(protect);
router.use(authorize('admin'));

// Inventory management
router.get('/', getInventory);
router.post('/', inventoryValidation, addToInventory);
router.put('/:id', updateInventoryItem);
router.delete('/:id', deleteInventoryItem);
router.get('/alerts', getInventoryAlerts);

module.exports = router;