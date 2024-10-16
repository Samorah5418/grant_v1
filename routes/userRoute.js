const express = require('express');
const router = express.Router();
const {registerUser, login, getAllUSer, getSingleUser, isApproved, deleteUser } = require('../controllers/userController')
const { authenticateUser, authorizePermissions} = require('../middleware/authentication')


router
.post('/register',  registerUser)
.post('/login',  login)
.get('/user', authenticateUser,  getSingleUser)
.get('/user/all', getAllUSer)
.post('/approve/:userId', isApproved )
.post("/delete/:userId", deleteUser)



module.exports = router