const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { authUser } = require('../middlewares/authMiddleware');

const userRouter = express.Router();

userRouter.get('/profile', authUser, getUserProfile);
userRouter.put('/profile', authUser, updateUserProfile);

module.exports = userRouter;
