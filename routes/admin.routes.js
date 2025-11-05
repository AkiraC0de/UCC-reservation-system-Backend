const express = require('express');

const {getUserList} = require('../controllers/admin.controller');
const verifyAdminJWT = require('../middlewares/verifyAdminJWT')

const adminRoutes = express.Router()

// #1 Get all the users data
adminRoutes.get('/all-user', verifyAdminJWT, getUserList)

module.exports = adminRoutes