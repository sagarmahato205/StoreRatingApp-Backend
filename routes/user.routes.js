const express = require("express");
const { getStores } = require("../controllers/user.controller");
const {
    authenticate,
    authorize
} = require("../middleware/auth.middleware");

const router = express.Router();

router.get(
    "/stores",
    authenticate,
    authorize("user"),
    getStores
);

module.exports = router;