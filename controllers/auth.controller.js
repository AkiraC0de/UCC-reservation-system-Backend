const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

const signUp = async (req, res) => {
    //Check if the request body has content
    if(!req.body) return res.status(400).json({success: false, message: "The request body is empty"});
    try {
        const {email} = req.body;

        //Validate if the Email has been registered
        const user = await User.findOne({email});
        if(user) return res.status(404).json({success: false, message: "The email has been already registred"});

        //Create the account
        const newUser = new User(req.body);

        //Validate the password
        // MUST BE VALIDATE IF THE UPPERCASE, LOWERCASE, AND NUMBER DOERS EXIST IN THE PASSWORD

        //hash the password
        newUser.password = await bcrypt.hash(newUser.password, 10);
        
        //Save the new user to the DB
        await newUser.save();

        res.status(200).json({success:true, data: newUser})

    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: false, message: error.message})
    }
}

const logIn = async (req, res) => {
    //Check if the request body has content
    if(!req.body) return res.status(400).json({success: false, message: "The request body is empty"});

    try {
        const {email, password} = req.body;

        //Validate if the Email does exist
        const user = await User.findOne({email});
        console.log(user)
        if(!user) return res.status(404).json({success: false, message: "The email has not been registred"});

        //Validate the password
        const passwordMatched = await bcrypt.compare(password, user.password);
        if(!passwordMatched) return res.status(400).json({success: false, message: "Password is incorrect"});

        // Generate Access token
        const accessToken = jwt.sign({id: user._id}, process.env.JWT_ACCESS_KEY, { expiresIn: '15m' });

        res.cookie('accessToken', accessToken, { httpOnly: true })

        res.status(200).json({success:true, message: "Log in success", data: user})

    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: false, message: error.message})
    }
}

module.exports = { signUp, logIn }