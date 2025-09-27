const express = require('express');
const verifyAuthJWT = require('../middlewares/verifyAuthJWT')

const { signUp, logIn, logOut, refresh } = require('../controllers/auth.controller')

const authRoute = express.Router()

//#1 Sign Up Route
authRoute.post('/signup', signUp)

//#2 Login Route
authRoute.post('/login', logIn)

//#3 Logout Route
authRoute.post('/logout', logOut)

//#4 Refresh Route
authRoute.post('/refresh', verifyAuthJWT, refresh)

module.exports = authRoute