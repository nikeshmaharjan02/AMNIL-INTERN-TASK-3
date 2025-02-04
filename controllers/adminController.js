const userModel = require('../models/userModel');

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({ role: 'user' }).select('-password'); // Exclude password
        res.json({ success: true, users });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

module.exports = { getAllUsers };
