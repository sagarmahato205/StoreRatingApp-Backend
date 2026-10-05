const bcrypt = require("bcrypt");
const { 
    getDashboardStats, 
    getAllUsers, 
    createUserByAdmin,
    findUserByEmail,
    getAllStores,
    createStore,
    findStoreOwnerById,
    getUserById,
    updateUserPassword
} = require("../models/admin.model");

const getDashboard = async (req, res) => {
    try {
        const stats = await getDashboardStats();

        res.status(200).json({
            success: true,
            dashboard: stats
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics"
        });
    }
};

const getAllUsersController = async (req, res) => {
    try {
        const users = await getAllUsers(req.query);

        res.status(200).json({
            success: true,
            users
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};

const getAllStoresController = async (req, res) => {
    try {
        const stores = await getAllStores(req.query);

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

const createUserController = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            address,
            role
        } = req.body;

        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await createUserByAdmin(
            name,
            email,
            hashedPassword,
            address,
            role
        );

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create user"
        });
    }
};

const createStoreController = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            ownerId
        } = req.body;

        const owner = await findStoreOwnerById(ownerId);

        if (!owner) {
            return res.status(400).json({
                success: false,
                message: "Invalid store owner"
            });
        }

        const store = await createStore(
            name,
            email,
            address,
            ownerId
        );

        res.status(201).json({
            success: true,
            message: "Store created successfully",
            store
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create store"
        });
    }
};

const getUserByIdController = async (req, res) => {
    try {
        const user = await getUserById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch user"
        });
    }
};

const updateUserPasswordController = async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.params.id;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await updateUserPassword(
            userId,
            hashedPassword
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update password"
        });
    }
};

module.exports = {
    getDashboard ,
    getAllUsersController,
    createUserController,
    getAllStoresController,
    createStoreController,
    getUserByIdController,
    updateUserPasswordController
};