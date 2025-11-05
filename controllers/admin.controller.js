const User = require('../models/user.model');

const getUserList = async (req, res) => {
  const allUsers = await User.find({})

  res.status(200).json(allUsers)
}

module.exports = {getUserList}
