const jwt = require('jsonwebtoken');

const verifyAuthJWT = async (req, res, next) => {
    const token = req.cookies.accessToken
    // Validate the Token
    if(!token) return res.status(400).json({success: false, message: "Missing Token"});
    
    try {
        const user = jwt.verify(token, process.env.JWT_ACCESS_KEY);
        req.user = user
        next();
    } catch (error) {
        console.log(error.message);
        res.status(400).json({success: false, message: "Token is invalid or expired"});
    }
}

module.exports = verifyAuthJWT