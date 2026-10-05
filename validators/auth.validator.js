const { body } = require("express-validator");
const { updatePassword } = require("../controllers/auth.controller");

const signupValidator = [
    body("name")
        .trim()
        .isLength({ min: 10, max: 60 })
        .withMessage("Name must be between 10 and 60 characters"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email"),

    body("password")
        .isLength({ min: 8, max: 16 })
        .withMessage("Password must be between 8 and 16 characters")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[^A-Za-z0-9]/)
        .withMessage("Password must contain at least one special character"),

    body("address")
        .trim()
        .isLength({ max: 400 })
        .withMessage("Address cannot exceed 400 characters")
];

const loginValidator = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
];

const updatePasswordValidator = [
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),

    body("newPassword")
        .isLength({ min: 8, max: 16 })
        .withMessage("Password must be between 8 and 16 characters")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[^A-Za-z0-9]/)
        .withMessage("Password must contain at least one special character")
];

module.exports = {
    signupValidator,
    loginValidator,
    updatePasswordValidator
};