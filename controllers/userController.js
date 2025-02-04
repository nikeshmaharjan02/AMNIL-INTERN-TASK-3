const userModel = require('../models/userModel');

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id

        const user = await userModel.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user })

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // User ID from the auth middleware
        const { name, email, gender, dob } = req.body;

        if (!name || !email  || !dob || !gender) {
            return res.json({success:false, message:"Data Missing"})
        }

        // Update user profile (excluding password)
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { name, email, gender, dob },
            { new: true } // Return updated user
        ).select('-password'); // Exclude password from response

        if (!updatedUser) {
            return res.json({ success: false, message: "User not found." });
        }

        res.json({ success: true, updatedUser });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

module.exports = { getUserProfile, updateUserProfile };