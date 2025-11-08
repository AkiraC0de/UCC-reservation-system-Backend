const express = require('express');

const { 
  getAllItems,
  createNewItem,
  deleteItem,
  getOneItem
 } = require('../controllers/Item.controller')
const verifyAdminJWT = require('../middlewares/verifyAdminJWT')
const { uploadItemFile } = require("../configs/newMuilter")

const itemRoutes = express.Router()

// #1 Get all the users data
itemRoutes.get('/', getAllItems)

itemRoutes.post('/', verifyAdminJWT, uploadItemFile.single("Image"), createNewItem)

itemRoutes.get('/oneItem/:id', getOneItem )

itemRoutes.delete('/:id', verifyAdminJWT, deleteItem)


module.exports = itemRoutes