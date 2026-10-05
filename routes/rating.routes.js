const express = require("express");

const {
    submitRating
} = require("../controllers/rating.controller");

const {
    authenticate,
    authorize
} = require("../middleware/auth.middleware");

const {
    ratingValidator
} = require("../validators/rating.validator");

const validate = require("../middleware/validation.middleware");

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("user"),
    ratingValidator,
    validate,
    submitRating
);

module.exports = router;