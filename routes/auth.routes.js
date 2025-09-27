const express = require('express');
const verifyAuthJWT = require('../middlewares/verifyAuthJWT')

const { signUp, logIn, refresh } = require('../controllers/auth.controller')

const authRoute = express.Router()

//#1 Sign Up Route
authRoute.post('/signup', signUp)

//#2 Login Up Route
authRoute.post('/login', logIn)

//#3 Refresh Up Route
authRoute.post('/refresh', verifyAuthJWT, refresh)

module.exports = authRoute