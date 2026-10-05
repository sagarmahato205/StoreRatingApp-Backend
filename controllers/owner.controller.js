const { getOwnerDashboard } = require("../models/owner.model")

const getDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id

    const dashboard = await getOwnerDashboard(ownerId)

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: "Store not found"
      })
    }

    res.status(200).json({
      success: true,
      dashboard
    })

  } catch (error) {
    console.error("Owner dashboard error:", error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch owner dashboard"
    })
  }
}

module.exports = {
  getDashboard
}