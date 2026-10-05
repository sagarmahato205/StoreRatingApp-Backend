const { body } = require("express-validator");

const createUserValidator = [
    body("name")
        .trim()
        .isLength({ min: 20, max: 60 })
        .withMessage("Name must be between 20 and 60 characters"),

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
        .withMessage("Address cannot exceed 400 characters"),

    body("role")
        .isIn(["user", "admin", "store_owner"])
        .withMessage("Role must be user, admin or store_owner")
];

const createStoreValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Store name is required")
        .isLength({ max: 100 })
        .withMessage("Store name cannot exceed 100 characters"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid store email"),

    body("address")
        .trim()
        .notEmpty()
        .withMessage("Address is required")
        .isLength({ max: 400 })
        .withMessage("Address cannot exceed 400 characters"),

    body("ownerId")
        .isInt({ min: 1 })
        .withMessage("Valid owner ID is required")
];

module.exports = {
    createUserValidator,
    createStoreValidator
};