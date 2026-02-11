const { body } = require('express-validator');

exports.bloodGroupValidator = (field = 'bloodGroup') => 
    body(field).isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .withMessage('Invalid blood group');

exports.phoneValidator = (field = 'phone') =>
    body(field).matches(/^[0-9]{10}$/)
        .withMessage('Phone number must be 10 digits');

exports.emailValidator = (field = 'email') =>
    body(field).isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail();

exports.passwordValidator = (field = 'password') =>
    body(field).isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters');

exports.locationValidator = () => [
    body('location.city').notEmpty().withMessage('City is required'),
    body('location.state').notEmpty().withMessage('State is required'),
    body('location.district').optional().notEmpty()
];