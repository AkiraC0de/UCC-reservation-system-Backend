const express = require('express');

const { 
  getAllItems,
  createNewItem,
  deleteItem
 } = require('../controllers/Item.controller')
const verifyAdminJWT = require('../middlewares/verifyAdminJWT')
const { uploadItemFile } = require("../configs/newMuilter")

const itemRoutes = express.Router()

// #1 Get all the users data
itemRoutes.get('/', getAllItems)

itemRoutes.post('/', verifyAdminJWT, uploadItemFile.single("Image"), createNewItem)

itemRoutes.delete('/:id', verifyAdminJWT, deleteItem)


module.exports = itemRoutes