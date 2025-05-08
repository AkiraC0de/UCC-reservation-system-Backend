const express = require('express');

const { signUp } = require('../controllers/auth.controller')

const authRoute = express.Router();

//#1 Sign Up Route
authRoute.post('/singup', signUp)

module.exports = authRoute;