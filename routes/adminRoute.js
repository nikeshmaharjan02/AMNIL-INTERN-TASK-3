const express = require('express');
const { getAllUsers } = require('../controllers/adminController'); 
const { authUser, authAdmin } = require('../middlewares/authMiddleware'); 

const adminRouter = express.Router();

adminRouter.get('/get-all-users', authUser, authAdmin, getAllUsers);

module.exports = adminRouter;
