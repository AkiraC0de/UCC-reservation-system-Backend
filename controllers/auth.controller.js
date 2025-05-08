const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const signUp = async (req, res) => {
    //Check if the request body has content
    if(!req.body) return res.status(400).json({success: false, message: "The request body is empty"});

    try {
        const {email} = req.body;

        //Validate if the Email has been registered
        const user = User.findOne({email});
        if(user) return res.status(404).json({success: false, message: "The email has been already registred"});

        //Create the account
        const newUser = new User(req.body);

        //Validate the password
        // MUST BE VALIDATE IF THE UPPERCASE, LOWERCASE, AND NUMBER DOERS EXIST IN THE PASSWORD

        //hash the password
        newUser.password = await bcrypt.hash(newUser.password, 10);
        
        //Save the new user to the DB
        await newUser.save();

        res.status(200).json({success:true, data})

    } catch (error) {
        
    }
}

module.exports = { signUp }