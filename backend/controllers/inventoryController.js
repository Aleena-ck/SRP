const BloodInventory = require('../models/BloodInventory');
const Admin = require('../models/Admin');

// @desc    Get inventory for admin center
// @route   GET /api/inventory
// @access  Private/Admin
exports.getInventory = async (req, res) => {
    try {
        const admin = await Admin.findOne({ userId: req.user.id });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin profile not found'
            });
        }

        const inventory = await BloodInventory.find({ adminId: admin._id })
            .sort({ bloodGroup: 1, componentType: 1 });

        // Group by blood group
        const groupedInventory = inventory.reduce((acc, item) => {
            if (!acc[item.bloodGroup]) {
                acc[item.bloodGroup] = {
                    availableUnits: 0,
                    reservedUnits: 0,
                    totalUnits: 0,
                    items: []
                };
            }
            acc[item.bloodGroup].availableUnits += item.availableUnits;
            acc[item.bloodGroup].reservedUnits += item.reservedUnits;
            acc[item.bloodGroup].totalUnits += item.totalUnits;
            acc[item.bloodGroup].items.push(item);
            return acc;
        }, {});

        // Get inventory summary
        const summary = Object.keys(groupedInventory).map(bloodGroup => ({
            bloodGroup,
            availableUnits: groupedInventory[bloodGroup].availableUnits,
            reservedUnits: groupedInventory[bloodGroup].reservedUnits,
            totalUnits: groupedInventory[bloodGroup].totalUnits
        }));

        // Get expiring soon items (within 7 days)
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        
        const expiringSoon = await BloodInventory.find({
            adminId: admin._id,
            expiryDate: { $lte: sevenDaysFromNow, $gte: new Date() },
            availableUnits: { $gt: 0 }
        }).sort({ expiryDate: 1 });

        // Get low stock items
        const lowStock = summary.filter(item => 
            item.availableUnits > 0 && item.availableUnits <= 5
        );

        res.status(200).json({
            success: true,
            summary,
            detailed: groupedInventory,
            alerts: {
                expiringSoon: expiringSoon.map(item => ({
                    bloodGroup: item.bloodGroup,
                    componentType: item.componentType,
                    availableUnits: item.availableUnits,
                    expiryDate: item.expiryDate,
                    daysToExpiry: item.daysToExpiry
                })),
                lowStock: lowStock.map(item => ({
                    bloodGroup: item.bloodGroup,
                    availableUnits: item.availableUnits
                })),
                criticalStock: summary.filter(item => item.availableUnits === 0)
            }
        });
    } catch (error) {
        console.error('Get inventory error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Add blood to inventory
// @route   POST /api/inventory
// @access  Private/Admin
exports.addToInventory = async (req, res) => {
    try {
        const admin = await Admin.findOne({ userId: req.user.id });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin profile not found'
            });
        }

        const {
            bloodGroup,
            componentType,
            availableUnits,
            collectionDate,
            expiryDate,
            batchNumber,
            donorId,
            donationId,
            storageLocation,
            storageTemperature,
            notes
        } = req.body;

        const inventoryItem = await BloodInventory.create({
            adminId: admin._id,
            bloodGroup,
            componentType: componentType || 'Whole Blood',
            availableUnits,
            reservedUnits: 0,
            totalUnits: availableUnits,
            collectionDate: collectionDate || new Date(),
            expiryDate: expiryDate || new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days default
            batchNumber,
            donorId,
            donationId,
            storageLocation,
            storageTemperature: storageTemperature || 'Refrigerated (2-6°C)',
            notes,
            status: 'Available'
        });

        // Update admin stats
        admin.stats.totalCollections = (admin.stats.totalCollections || 0) + 1;
        await admin.save();

        res.status(201).json({
            success: true,
            message: 'Blood added to inventory successfully',
            inventoryItem
        });
    } catch (error) {
        console.error('Add to inventory error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private/Admin
exports.updateInventoryItem = async (req, res) => {
    try {
        const admin = await Admin.findOne({ userId: req.user.id });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin profile not found'
            });
        }

        const inventoryItem = await BloodInventory.findById(req.params.id);
        if (!inventoryItem) {
            return res.status(404).json({
                success: false,
                message: 'Inventory item not found'
            });
        }

        // Check if item belongs to admin
        if (inventoryItem.adminId.toString() !== admin._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this inventory item'
            });
        }

        const allowedUpdates = [
            'availableUnits', 'reservedUnits', 'storageLocation',
            'storageTemperature', 'status', 'notes', 'testResults'
        ];

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                if (typeof req.body[field] === 'object' && !Array.isArray(req.body[field])) {
                    inventoryItem[field] = { ...inventoryItem[field], ...req.body[field] };
                } else {
                    inventoryItem[field] = req.body[field];
                }
            }
        });

        // Recalculate total units
        inventoryItem.totalUnits = inventoryItem.availableUnits + inventoryItem.reservedUnits;

        await inventoryItem.save();

        res.status(200).json({
            success: true,
            message: 'Inventory item updated successfully',
            inventoryItem
        });
    } catch (error) {
        console.error('Update inventory error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private/Admin
exports.deleteInventoryItem = async (req, res) => {
    try {
        const admin = await Admin.findOne({ userId: req.user.id });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin profile not found'
            });
        }

        const inventoryItem = await BloodInventory.findById(req.params.id);
        if (!inventoryItem) {
            return res.status(404).json({
                success: false,
                message: 'Inventory item not found'
            });
        }

        // Check if item belongs to admin
        if (inventoryItem.adminId.toString() !== admin._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this inventory item'
            });
        }

        // Only allow deletion if no units are reserved or used
        if (inventoryItem.reservedUnits > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete inventory item with reserved units'
            });
        }

        await inventoryItem.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Inventory item deleted successfully'
        });
    } catch (error) {
        console.error('Delete inventory error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Search blood in inventory
// @route   GET /api/inventory/search
// @access  Public
exports.searchBlood = async (req, res) => {
    try {
        const { bloodGroup, componentType, city, minUnits = 1 } = req.query;

        if (!bloodGroup) {
            return res.status(400).json({
                success: false,
                message: 'Please specify blood group'
            });
        }

        // First find centers in the city if specified
        let centerFilter = { isVerified: true };
        if (city && city !== 'All') {
            centerFilter['location.city'] = city;
        }

        const centers = await Admin.find(centerFilter)
            .select('_id organizationName location contactInfo');

        const centerIds = centers.map(center => center._id);

        // Find inventory items
        const inventoryFilter = {
            adminId: { $in: centerIds },
            bloodGroup,
            availableUnits: { $gte: parseInt(minUnits) },
            status: 'Available'
        };

        if (componentType && componentType !== 'All') {
            inventoryFilter.componentType = componentType;
        }

        const inventoryItems = await BloodInventory.find(inventoryFilter)
            .populate('adminId', 'organizationName location contactInfo')
            .sort({ expiryDate: 1 });

        // Format results
        const results = inventoryItems.map(item => ({
            centerId: item.adminId._id,
            centerName: item.adminId.organizationName,
            location: `${item.adminId.location?.city || ''}, ${item.adminId.location?.district || ''}`,
            contact: item.adminId.contactInfo?.phone?.[0] || 'Not available',
            bloodGroup: item.bloodGroup,
            componentType: item.componentType,
            availableUnits: item.availableUnits,
            expiryDate: item.expiryDate,
            daysToExpiry: item.daysToExpiry,
            storageTemperature: item.storageTemperature
        }));

        res.status(200).json({
            success: true,
            count: results.length,
            results,
            summary: {
                totalCenters: new Set(results.map(r => r.centerId)).size,
                totalUnits: results.reduce((sum, item) => sum + item.availableUnits, 0)
            }
        });
    } catch (error) {
        console.error('Search blood error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get inventory alerts
// @route   GET /api/inventory/alerts
// @access  Private/Admin
exports.getInventoryAlerts = async (req, res) => {
    try {
        const admin = await Admin.findOne({ userId: req.user.id });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin profile not found'
            });
        }

        const now = new Date();
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

        // Get expiring items
        const expiringItems = await BloodInventory.find({
            adminId: admin._id,
            expiryDate: { $lte: sevenDaysFromNow, $gt: now },
            availableUnits: { $gt: 0 }
        }).sort({ expiryDate: 1 });

        // Get critical expiring items (within 3 days)
        const criticalExpiring = expiringItems.filter(item => 
            item.expiryDate <= threeDaysFromNow
        );

        // Get low stock items
        const allItems = await BloodInventory.find({ adminId: admin._id });
        const groupedByBloodGroup = allItems.reduce((acc, item) => {
            if (!acc[item.bloodGroup]) {
                acc[item.bloodGroup] = 0;
            }
            acc[item.bloodGroup] += item.availableUnits;
            return acc;
        }, {});

        const lowStock = Object.entries(groupedByBloodGroup)
            .filter(([_, units]) => units > 0 && units <= 5)
            .map(([bloodGroup, units]) => ({ bloodGroup, units }));

        const outOfStock = Object.entries(groupedByBloodGroup)
            .filter(([_, units]) => units === 0)
            .map(([bloodGroup]) => ({ bloodGroup }));

        res.status(200).json({
            success: true,
            alerts: {
                expiringSoon: expiringItems.map(item => ({
                    id: item._id,
                    bloodGroup: item.bloodGroup,
                    componentType: item.componentType,
                    availableUnits: item.availableUnits,
                    expiryDate: item.expiryDate,
                    daysToExpiry: item.daysToExpiry,
                    isCritical: item.expiryDate <= threeDaysFromNow
                })),
                criticalExpiring: criticalExpiring.map(item => ({
                    id: item._id,
                    bloodGroup: item.bloodGroup,
                    componentType: item.componentType,
                    availableUnits: item.availableUnits,
                    expiryDate: item.expiryDate,
                    daysToExpiry: item.daysToExpiry
                })),
                lowStock,
                outOfStock,
                totalAlerts: expiringItems.length + lowStock.length + outOfStock.length
            }
        });
    } catch (error) {
        console.error('Get inventory alerts error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};