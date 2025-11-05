const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const crypto = require("crypto");
const {sendVerificationEmail} = require("../utils/sendCodeEmail")
/**
 * @desc Register a new user
 * @route POST /api/auth/signup
 * @access Public
 */
const signUp = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Request body is empty.",
    });
  }

  const { firstName, lastName, program, yearLevel, section, email, password, role } = req.body;

  if (!firstName || !lastName || !program || !yearLevel || !section || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
      errorFor: "global"
    });
  }

  try {
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If email exists and is already verified, don't allow signup
      if (existingUser.isEmailVerified) {
        return res.status(409).json({
          success: false,
          message: "Email is already registered.",
          errorFor: "email"
        });
      }
      
      // If email exists but is NOT verified, delete the old unverified account
      // This allows the user to re-register with updated information
      await User.deleteOne({ _id: existingUser._id });
      console.log(`Deleted unverified account for email: ${email}`);
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and contain an uppercase letter, lowercase letter, and a number.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a 6-digit verification code
    const verificationCode = crypto.randomInt(0, 1000000).toString().padStart(6, "0");

    // Create new user (unverified by default)
    const newUser = new User({
      firstName,
      lastName,
      program,
      yearLevel,
      section,
      role,
      email: email.toLowerCase(),
      password: hashedPassword,
      isEmailVerified: false,
      verificationCode,
    });

    await newUser.save();

    await sendVerificationEmail(newUser.email, verificationCode);

    res.status(201).json({
      success: true,
      message: "Account created successfully. Please verify your email.",
      data: {
        id: newUser._id,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Sign-up error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
}

const logIn = async (req, res) => {
    //Check if the request body has content
    if(!req.body) return res.status(400).json({success: false, message: "The request body is empty"});

    try {
        const {email, password} = req.body;

        //Validate if the Email does exist
        const user = await User.findOne({email});
        if(!user || !user.isEmailVerified) return res.status(404).json({success: false, errorAt: "email", message: "The email has not been registred"});

        //Validate the password
        const passwordMatched = await bcrypt.compare(password, user.password);
        if(!passwordMatched) return res.status(400).json({success: false,  errorAt: "password", message: "Password is incorrect"});

        // Extract user data for response
        const {firstName, lastName, reservationsMade, role} = user
        const userData = {
            firstName,
            lastName,
            role,
            email : user.email,
            reservationsMade,
        }

        // Generate Access token
        const accessToken = jwt.sign({id: user._id, role}, process.env.JWT_ACCESS_KEY, { expiresIn: '7d' });

        res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: 'Lax' })

        res.status(200).json({success:true, message: "Log in success", data: userData})

    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: false, message: error.message})
    }
}

const refresh = async (req, res) => {
    const {id} = req.user

    try {
        // Find the user
        const user = await User.findById(id)
        // Extract user data for response
        const {firstName, lastName, email, reservationsMade, role} = user
        const userData = {
            firstName,
            lastName,
            role,
            email,
            reservationsMade,
        }

        // Generate Access token
        const accessToken = jwt.sign({id: user.id, role}, process.env.JWT_ACCESS_KEY, { expiresIn: '15d' });
        
        res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 15 })

        res.status(200).json({success:true, message: "Log in success", data: userData})

    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: false, message: error.message})
    }
}

const logOut = async (req, res) => {
    res.cookie('accessToken', '', {
        httpOnly: true,         
        sameSite: 'Lax',           
        expires: new Date(0)     
    })

    res.status(200).json({ success: true, message: "Logout Success"})
}

const verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  if(!email){
    return res.status(404).json({ success: false, message: "Email is required." });
  }

  if(!code){
    return res.status(404).json({ success: false, message: "Verification Code is required." });
  }

  try {

    const user = await User.findOne({ email });
    if (!user){
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (user.verificationCode !== Number(code)) {
      return res.status(400).json({ success: false, message: "Invalid verification code." });
    }

    user.isEmailVerified = true;
    user.verificationCode = null; 
    await user.save();

    res.status(200).json({ success: true, message: "Email verified successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Resend Verification Code
 * POST /api/auth/resend-verification
 */
const resendVerification = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Request body is empty.",
    });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified.",
      });
    }

    // Generate a new 6-digit verification code
    const verificationCode = crypto.randomInt(0, 1000000).toString().padStart(6, "0");

    // Update user's verification code
    user.verificationCode = verificationCode;
    await user.save();

    // Send verification email
    await sendVerificationEmail(user.email, verificationCode);

    res.status(200).json({
      success: true,
      message: "Verification code resent successfully.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
}


module.exports = { signUp, logIn, logOut, refresh, verifyEmail, resendVerification }