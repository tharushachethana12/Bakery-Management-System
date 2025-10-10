const express = require("express");
const router = express.Router();
const UserController = require("../Controlers/UserControllers");

// Public routes
router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);

// User management routes
router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getById);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

module.exports = router;