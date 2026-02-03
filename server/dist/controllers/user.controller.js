"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.forgotPassword = exports.loginUser = exports.registerUser = void 0;
const user_service_1 = require("../services/user.service");
const service = new user_service_1.UserService();
const registerUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const user = await service.register(email, password, role);
        res.status(201).json({ message: "User registered successfully", user });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await service.login(email, password);
        res.json({ message: "Login successful", ...result });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.loginUser = loginUser;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        await service.forgotPassword(email);
        res.json({ message: "If this email exists, a reset link has been sent." });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.forgotPassword = forgotPassword;
const changePassword = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { oldPassword, newPassword } = req.body;
        await service.changePassword(userId, oldPassword, newPassword);
        res.json({ message: "Password changed successfully" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.changePassword = changePassword;
