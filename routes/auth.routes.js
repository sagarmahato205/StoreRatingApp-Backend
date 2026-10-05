const express = require("express");

const {
    signUp,
    login,
    updatePassword
} = require("../controllers/auth.controller");

const {
    signupValidator,
    loginValidator,
    updatePasswordValidator
} = require("../validators/auth.validator");

const { authenticate } = require("../middleware/auth.middleware");

const validate = require("../middleware/validation.middleware");

const router = express.Router();

router.post(
    "/signUp",
    signupValidator,
    validate,
    signUp
);

router.post(
    "/login",
    loginValidator,
    validate,
    login
);

router.patch(
    "/update-password",
    authenticate,
    updatePasswordValidator,
    validate,
    updatePassword
);

module.exports = router;