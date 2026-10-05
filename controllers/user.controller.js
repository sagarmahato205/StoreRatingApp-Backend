const { getStoresForUser } = require("../models/user.model");

const getStores = async (req, res) => {
    try {
        const stores = await getStoresForUser(
            req.user.id,
            req.query
        );

        res.status(200).json({
            success: true,
            stores
        });
        
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch stores"
        });
    }
};

module.exports = {
    getStores
};