const express = require("express");
const { 
    getDashboard,
    getAllUsersController,
    createUserController,
    getAllStoresController,
    createStoreController,
    getUserByIdController,
    updateUserPasswordController
 } = require("../controllers/admin.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const { 
    createUserValidator,
    createStoreValidator
 } = require("../validators/admin.validator");
const validate = require("../middleware/validation.middleware");

const router = express.Router();

router.get(
    "/dashboard",
    authenticate,
    authorize("admin"),
    getDashboard
);

router.get(
    "/users",
    authenticate,
    authorize("admin"),
    getAllUsersController
);

router.post(
    "/users",
    authenticate,
    authorize("admin"),
    createUserController
);

router.post(
    "/users",
    authenticate,
    authorize("admin"),
    createUserValidator,
    validate,
    createUserController
);

router.get(
    "/stores",
    authenticate,
    authorize("admin"),
    getAllStoresController
);

router.get(
    "/stores",
    authenticate,
    authorize("admin"),
    getAllStoresController
);

router.post(
    "/stores",
    authenticate,
    authorize("admin"),
    createStoreValidator,
    validate,
    createStoreController
);

router.get(
    "/users/:id",
    authenticate,
    authorize("admin"),
    getUserByIdController
);

router.patch(
    "/users/:id/password",
    authenticate,
    authorize("admin"),
    updateUserPasswordController
);  


module.exports = router;