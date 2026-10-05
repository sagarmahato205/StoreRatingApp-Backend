const { createOrUpdateRating } = require("../models/rating.model");

const submitRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { storeId, rating } = req.body;

        const result = await createOrUpdateRating(
            userId,
            storeId,
            rating
        );

        res.status(200).json({
            success: true,
            message: "Rating submitted successfully",
            rating: result
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to submit rating"
        });
    }
};

module.exports = {
    submitRating
};