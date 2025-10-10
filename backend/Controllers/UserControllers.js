const User = require("../Model/UserModel");

// User Registration
const registerUser = async (req, res, next) => {
    try {
        const { name, email, phone, password, confirmPassword, agreeToTerms } = req.body;

        // Validation
        if (!name || !email || !phone || !password || !agreeToTerms) {
            return res.status(400).json({ 
                success: false,
                message: "All fields are required" 
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ 
                success: false,
                message: "Passwords do not match" 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                success: false,
                message: "Password must be at least 6 characters long" 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: "User already exists with this email" 
            });
        }

        // Create new user
        const user = new User({
            name,
            email,
            phone,
            password,
            agreeToTerms
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ 
            success: false,
            message: "Server error during registration" 
        });
    }
};

// User Login
const loginUser = async (req, res, next) => {
    try {
        const { email, password, rememberMe } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: "Email and password are required" 
            });
        }

        // Find user and include password for comparison
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid email or password" 
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid email or password" 
            });
        }

        // Update rememberMe if provided
        if (rememberMe !== undefined) {
            user.rememberMe = rememberMe;
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                rememberMe: user.rememberMe
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            success: false,
            message: "Server error during login" 
        });
    }
};

// Get all users (for admin purposes)
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");
        
        if (!users || users.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: "No users found" 
            });
        }

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({ 
            success: false,
            message: "Server error while fetching users" 
        });
    }
};

// Get user by ID
const getById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        
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
        console.error("Get user error:", error);
        res.status(500).json({ 
            success: false,
            message: "Server error while fetching user" 
        });
    }
};

// Update user
const updateUser = async (req, res, next) => {
    try {
        const { name, email, phone } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, phone },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user
        });
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ 
            success: false,
            message: "Server error while updating user" 
        });
    }
};

// Delete user
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ 
            success: false,
            message: "Server error while deleting user" 
        });
    }
};

exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getAllUsers = getAllUsers;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;