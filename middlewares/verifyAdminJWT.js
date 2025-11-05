const jwt = require('jsonwebtoken')

const verifyAdminJWT = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if(!token)  return res.status(400).json({success: false, message: "Missing Token"});

  try {
      const user = jwt.verify(token, process.env.JWT_ACCESS_KEY);
      if(user.role !== "admin") return res.status(400).json({success: false, message: "You are not allowed to access this API"});

      req.user = user;
      next();
  } catch (error) {
      console.log(error.message);
      res.status(400).json({success: false, message: "Token is invalid or expired"});
  }
}

module.exports = verifyAdminJWT;