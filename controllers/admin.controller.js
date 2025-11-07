const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const Reservation = require('../models/reservation.model.js');
const ItemReservation = require('../models/itemReservation.model.js')

const sendRejectionEmail = require("../utils/sendRejectionEmail")

const getUserList = async (req, res) => {
  const allUsers = await User.find({isEmailVerified: true})
  .populate("reservationsMade")
  .populate("itemsReserved")
  .sort({ createdAt: -1 })

  res.status(200).json({success: true, data: allUsers})
}

const updateUserData = async (req, res) => {
  const { _id, updatedAt, createdAt, ...safeBody } = req.body; 

  //Look for the data if it was existed before updating it
  const findData = await User.findById(req.params.id);

  try {
    if(!findData) {
        return res.status(404).json({
            success: false,
            message: `The Reservation ${findData.id}} is not existed`
        })
    }

    const data = await User.findOneAndUpdate({_id: req.params.id}, safeBody, { new: true });
        
    res.status(200).json({
        success: true,
        message: `The User ${req.params.id} has been updated.`, 
        data: data
    })
  } catch (error) {
    res.status(500).json({
        success: false,
        message: error.message, 
    })
  }
}

const createUser = async (req, res) => {
  const {email, password} = req.body
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

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and contain an uppercase letter, lowercase letter, and a number.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ ...req.body,
      email: email.toLowerCase(),
      password: hashedPassword,
      isEmailVerified: true,
      status: "verified"
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Account created successfully. Please verify your email.",
      data: {
        id: newUser._id,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Account created unsuccessfully : ${error.message}`,
    });
  }
}

const rejectUser = async (req, res) => {
  const { _id, updatedAt, createdAt, ...safeBody } = req.body; 

  //Look for the data if it was existed before updating it
  const findData = await User.findById(req.params.id);

  try {
    if(!findData) {
        return res.status(404).json({
            success: false,
            message: `The Reservation ${findData.id}} is not existed`
        })
    }

    const data = await User.findOneAndUpdate({_id: req.params.id}, { status : "rejected" }, { new: true });

    const usersFullName = `${data.firstName} ${data.lastName}`

    await sendRejectionEmail(data.email, usersFullName, req.body.reason)
        
    res.status(200).json({
        success: true,
        message: `The User ${req.params.id} has been updated.`, 
        data: data
    })
  } catch (error) {
    res.status(500).json({
        success: false,
        message: error.message, 
    })
  }
}

/**
 * Get ALL reservations (Rooms + Items) and return in unified format
 * Example return:
 * {
 *   date: '2025-11-06',
 *   type: 'Room',
 *   room: 'Room 301',  // OR "LCD Projector", "Keyboard", etc.
 *   purpose: 'Laboratory Activity',
 *   startingTime: 9,
 *   outTime: 12,
 *   status: 'accepted',
 *   reservedBy: 'Juan Dela Cruz'
 * }
 */
const getReservationCalendar = async (req, res) => {
  try {
    
    const roomReservations = await Reservation.find()
      .populate("reservedBy", "firstName lastName").sort({ createdAt: -1 })
      .lean();

    const itemReservations = await ItemReservation.find()
      .populate("reservedBy", "firstName lastName").sort({ createdAt: -1 })
      .lean();

    // 🔹 Format ROOM reservations
    const formattedRooms = await Promise.all(
      roomReservations.map(async (r) => {

        return {
          date: r.date,
          type: "Room",
          room:`Room ${r.roomId}`, // fallback
          purpose: r.purpose,
          startingTime: r.startingTime,
          outTime: r.outTime,
          status: r.status,
          reservedBy: `${r.reservedBy.firstName} ${r.reservedBy.lastName}`,
        };
      })
    );

    // 🔹 Format ITEM reservations
    const formattedItems = await Promise.all(
      itemReservations.map(async (i) => {

        return {
          date: i.date,
          type: "Item",
          room: `Item ${i.itemId}`,
          purpose: i.purpose,
          startingTime: i.startingTime,
          outTime: i.outTime,
          status: i.status,
          reservedBy: `${i.reservedBy.firstName} ${i.reservedBy.lastName}`,
        };
      })
    );

    const allReservations = [...formattedRooms, ...formattedItems].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );


    return res.status(200).json({
      success: true,
      total: allReservations.length,
      data: allReservations,
    });
  } catch (error) {
    console.error("GET RESERVATIONS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed retrieving reservations",
      error: error.message,
    });
  }
};


module.exports = {getUserList, updateUserData, createUser, rejectUser, getReservationCalendar}
