const express = require('express');

const { signUp, logIn } = require('../controllers/auth.controller')

const authRoute = express.Router();

//#1 Sign Up Route
authRoute.post('/signup', signUp)

//#2 Login Up Route
authRoute.post('/login', logIn)

module.exports = authRoute;