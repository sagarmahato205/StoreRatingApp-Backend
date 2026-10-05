const express = require("express")
const router = express.Router()

const { authenticate, authorize } = require("../middleware/auth.middleware")
const { getDashboard } = require("../controllers/owner.controller")

router.get(
  "/dashboard",
  authenticate,
  authorize("store_owner"),
  getDashboard
)

module.exports = router