const validator = require('validator');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendEmail = require('../utils/emailService');


// api to register user
const registerUser = async (req, res) => {
    try {
        const {name, email, password, role} = req.body

        // checking for all data to add user
        if (!name || !password || !email) {
            return res.json({success:false,message:"Missing Details"})
        }

        //validating email format
        if (!validator.isEmail(email)) {
            return res.json({success:false,message:"Please Enter a Valid Email"})
        }

        //validating strong password
        if (password.length < 8){ 
            return res.json({success:false,message:"Please Enter a Strong Password"})
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "Email already registered" });
        }

        // hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Creating new user
        const user = new userModel({
            name,
            email,
            password: hashedPassword,
            role: role || "user"  // Default role is "user"
        });
        await user.save()

        const token = jwt.sign({id: user._id, role: user.role},process.env.JWT_SECRET)

        res.json({success:true,token})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
};

// api to register user
const loginUser = async (req,res) => {
    try {
        const { email, password} = req.body
        const user = await userModel.findOne({email})

        if(!user) {
            return res.json({success:false,message:"User doesnot exist"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(isMatch) {
            const token = jwt.sign({id: user._id, role: user.role },process.env.JWT_SECRET)
            res.json({success:true,token})
        } else {
            res.json({success:false,message:"Invalid Credentials!!"})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
};


const forgotPassword = async (req,res)=> {
    try {
        const {email} = req.body

        //validate required fiels
        if (!email) {
            return res.json({success:false, message:"Email required"})
        }

        const user = await userModel.findOne({email})

        if (!user) {
            return res.json({success:false,message:"User not found"})
        }
        const resetToken = jwt.sign({id: user._id, role: user.role},process.env.RESET_TOKEN,{expiresIn: "10m"})


        const resetLink = `http://localhost:4000/api/auth/reset-password?token=${resetToken}`

        await sendEmail(user.email, "Reset Password", `Click the link to reset your password: ${resetLink}`);
        res.json({succcess:true, message:"Reset Password Email Sent Successfully"})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
const resetPassword = async (req,res)=> {
    try {
        const {password} = req.body
        const token = req.query.token;

        //validate required fiels
        if (!token || !password) {
            return res.json({success:false, message:"Password is required"})
        }

        const decoded = jwt.verify(token, process.env.RESET_TOKEN);
        // hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const updatedUser = await userModel.findByIdAndUpdate(decoded.id,{password:hashedPassword}, { new: true }).select("-password");

        
        res.json({succcess:true, message:"Reset Password Successfully",updatedUser})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}



module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
