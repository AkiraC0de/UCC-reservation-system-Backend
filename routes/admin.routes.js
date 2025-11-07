const express = require('express');

const {getUserList, updateUserData, createUser} = require('../controllers/admin.controller');
const verifyAdminJWT = require('../middlewares/verifyAdminJWT')

const adminRoutes = express.Router()

// #1 Get all the users data
adminRoutes.get('/all-user', verifyAdminJWT, getUserList)

adminRoutes.put('/user/:id', verifyAdminJWT, updateUserData)

adminRoutes.post('/user', verifyAdminJWT, createUser)

module.exports = adminRoutes