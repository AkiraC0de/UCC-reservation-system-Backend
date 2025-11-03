const Reservation = require('../models/reservation.model.js');
const User = require('../models/user.model.js'); 

const {formatDateToString} = require('../utils/formatDate.js')

const getUserReservations = async (req, res) => {
    const { limit } = req.query; //access queries;
    const { id } = req.user;  
    
    try {
        const data = await Reservation.find({ reservedBy: id }).populate('reservedBy').sort({ createdAt: -1 });
        const filteredData = data.filter(item => item.reservedBy._id.equals(id));

  
        //Check if the limit query is existed
        if(limit){
            const limitData = filteredData.slice(0, limit)
             return res.status(200).json({
                success: true,
                data: limitData,
            })
        }

        res.status(200).json({
            success: true,
            data: filteredData,
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: 'Server error while fetching reservations'
        });
    }
}

const addReservation = async (req, res) => { 
    const user = req.user
    try {
        //Should add validation if the reservation will hava a conflic to other reservations

        const newReservation =  await Reservation.create({
            ...req.body,
            reservedBy: user.id,
            type: "Reserved"
        });
        
        res.status(201).json({
            success: true,
            message: `The reservation request has been successfully sent..`, 
            data: newReservation
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: `Server Error: Reservation cannot be sent.`
        })
    }
}

const updateReservation = async (req, res) => {
    // Prevent modifying immutable data 
    // _id updatedAt createdAt
    const { _id, updatedAt, createdAt, ...safeBody } = req.body; 
    const user = req.user;

    try {
        //Look for the data if it was existed before updating it
        const findData = await Reservation.findById(req.params.id);

        if(!findData) {
            return res.status(404).json({
                success: false,
                message: `The Reservation ${user.id}} is not existed`
            })
        }

        // Validate if the user own this reservation before updating
        const reservedById = String(findData.reservedBy);
        const userId = String(user.id)

        if(reservedById !== userId){
            return res.status(403).json({
                success: false,
                message: `You are not Authorized to Update this reservation`
            })
        }

        //update the data
        const data = await Reservation.updateOne({_id: req.params.id}, safeBody);
       
        res.status(200).json({
            success: true,
            message: `The Reservation ${req.params.id} has been updated.`, 
            data: data
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Server Error: Reservation ${req.params.id} cannot be updated.`,
        })
    }
} 

const deleteReservation = async (req, res) => {
    const user = req.user;

    try {
        const reservation = await Reservation.findById(req.params.id);

        if(!reservation){
            return res.status(404).json({
                success: false,
                message: `The Reservation ${req.params.id} is not existed` 
            })
        }

         // Validate if the user own this reservation before deleting
        const reservedById = String(reservation.reservedBy);
        const userId = String(user.id)

        if(reservedById !== userId){
            return res.status(403).json({
                success: false,
                message: `You are not Authorized to Delete this reservation`
            })
        }

        const data = await Reservation.deleteOne({_id: req.params.id});
        res.status(200).json({
            success: true,
            message: `The reservation ${req.params.id} has been deleted`,
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: `Server Error: Reservation ${req.params.id} cannot be deleted.`})
    }
}

/**
 * Controller to fetch all Confirmed reservations for a specific room
 * within the next 7 days, based on the 'date' field.
 * * @route GET /api/all-reservation?roomId={roomId}
 */
const getRoomReservationsForNext7Days = async (req, res) => {
    // 1. Get roomId from query parameters (Standard for GET requests)
    const { roomId } = req.query; 

    // 2. Validate roomId presence
    if (!roomId) {
        return res.status(400).json({
            success: false,
            message: 'roomId is required in the query parameters.'
        });
    }

    try {
        // --- Date Calculation Logic ---
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today

        // Calculate the starting date string (Today)
        const todayString = formatDateToString(today);

        // Calculate 7 days from now (inclusive)
        const sevenDaysLater = new Date(today);
        sevenDaysLater.setDate(today.getDate() + 7);
        // We look for reservations up to the end of the 7th day, so we don't change the hours/minutes/seconds.

        // Calculate the *exclusive* string for the range
        const exclusiveEndString = formatDateToString(sevenDaysLater);

        // Mongoose query finds reservations that:
        // 1. Match the provided roomId
        // 2. Have a status of "Confirmed"
        // 3. Have a 'date' greater than or equal to today
        // 4. Have a 'date' less than the date 7 days from now (effectively including 7 days total)
        const data = await Reservation.find({
            roomId: roomId,
            status: "accepted", // Only "confirmed" reservations
            date: { 
                $gte: todayString,         // Start today (e.g., "2025-10-04")
                $lt: exclusiveEndString    // End before 7 days from today (e.g., "2025-10-11")
            }
        })
        .populate('reservedBy') // Populate the user details if needed
        .sort({ date: 1 }); // Sort by date and then starting time

        // console.log(data)

        const computedData = data.map(item => ({
            ...item._doc,
            hours: (item.outTime - item.startingTime + 1) / 2
        }))

        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No confirmed reservations found for this room in the next 7 days.'
            });
        }

        res.status(200).json({
            success: true,
            data: computedData
        })

    } catch (error) {
        console.error("Error fetching room reservations:", error.message);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching room reservations.'
        });
    }
}

const getAllReservation = async (req, res) => {
    try {
        // Fetch all reservations and populate the 'reservedBy' field
        const data = await Reservation.find()
            .populate('reservedBy')     // Include user info who reserved
            .sort({ createdAt: -1 });   // Sort by most recent first

        // If there are no reservations found
        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No reservations found.'
            });
        }

        // Send back the found reservations
        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error("Error fetching all reservations:", error.message);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching all reservations.'
        });
    }
}

const sendEmail = require("../utils/sendEmail.js");
const updateSingleReservationAdmin = async (req, res) => {
  const { id } = req.params; // Reservation ID from the URL
  const { _id, createdAt, updatedAt, reservedBy, ...safeBody } = req.body; // Prevent updating sensitive fields

  try {
    // Find the reservation first
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `Reservation with ID ${id} does not exist.`,
      });
    }

    // Update the reservation with allowed fields only
    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      { ...safeBody },
      { new: true } // Return updated document
    ).populate("reservedBy"); // Optional: show who reserved it

    const userEmail = updatedReservation.reservedBy.email;
    const userName = updatedReservation.reservedBy.firstName;

    await sendEmail(
    userEmail,
    "Your Reservation Status Has Been Updated",
    `
        <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        padding: 24px;
        background-color: #f9f9f9;
        color: #333;
        ">
        <h2 style="color: #16a34a;">Hello ${userName},</h2>

        <p>
            We wanted to let you know that your reservation has been updated.  
            Below are the details of your reservation:
        </p>

        <div style="
            background-color: #ffffff;
            padding: 16px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 5px solid #16a34a;
        ">
            <p><b>Reservation ID:</b> ${updatedReservation._id}</p>
            <p><b>Room ID:</b> ${updatedReservation.roomId || "N/A"}</p>
            <p><b>Date:</b> ${updatedReservation.date}</p>
            <p><b>Purpose:</b> ${updatedReservation.purpose}</p>
            <p><b>Status:</b> 
            <span style="color: ${
                updatedReservation.status === "accepted"
                ? "#16a34a"
                : updatedReservation.status === "rejected"
                ? "#dc2626"
                : "#d97706"
            };">
                ${updatedReservation.status.toUpperCase()}
            </span>
            </p>
        </div>

        <p>
            Thank you for using our reservation system.  
            If you have any questions, please contact the admin team.
        </p>

        <p style="
            color: gray;
            font-size: 14px;
            margin-top: 20px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        ">
            — Admin
        </p>
        </div>
    `
    );


    res.status(200).json({
      success: true,
      message: `Reservation ${id} has been updated successfully.`,
      data: updatedReservation,
    });
  } catch (error) {
    console.error("Error updating reservation:", error.message);
    res.status(500).json({
      success: false,
      message: `Server error: Reservation ${id} cannot be updated.`,
    });
  }
};

const ItemReservation = require('../models/itemReservation.model.js')

// @desc    Create a new reservation
// @route   POST /api/reservations
// @access  Private (depending on your setup)
const createReservation = async (req, res) => {
     const user = req.user;
  try {
    const {
      itemId,
      date,
      startingTime,
      outTime,
      purpose,
      type,
    } = req.body

    if (!itemId || !date || startingTime == null || !outTime || !purpose) {
      return res.status(400).json({ message: "All fields are required." })
    }

    const userExists = await User.findById(user.id)
    if (!userExists) {
      return res.status(404).json({ message: "User not found." })
    }

    const newReservation = new ItemReservation({
      itemId,
      date,
      startingTime,
      outTime,
      purpose,
      type: type || 'Reserved',
      reservedBy: user.id
    })

    await newReservation.save()

    // 5️⃣ Respond with success
    res.status(201).json({
      message: "Reservation created successfully.",
      reservation: newReservation
    })

  } catch (error) {
    console.error("Error creating reservation:", error)
    res.status(500).json({
      message: "Internal server error.",
      error: error.message
    })
  }
}

const getAllReservations = async (req, res) => {
  try {
    const reservations = await ItemReservation.find()
      .populate('reservedBy') // Optional: populate user info
      .sort({ date: -1, startingTime: 1 }); // Optional: sort by most recent first

    if (!reservations || reservations.length === 0) {
      return res.status(404).json({ message: "No reservations found." });
    }

    res.status(200).json({
      message: "Reservations fetched successfully.",
      success: true,
      data : reservations
    });

  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message
    });
  }
}

const updateItemReservation = async (req, res) => {
  try {
    const { id } = req.params; // Reservation ID from the URL
    const { _id, createdAt, updatedAt, reservedBy, ...safeBody } = req.body;

    // 1️⃣ Check if reservation exists
    const reservation = await ItemReservation.findById(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `Reservation with ID ${id} does not exist.`,
      });
    }

    // Update the reservation with allowed fields only
    const updatedReservation = await ItemReservation.findByIdAndUpdate(
      id,
      { ...safeBody },
      { new: true } // Return updated document
    ).populate("reservedBy"); // Optional: show who reserved it

    const userEmail = updatedReservation.reservedBy.email;
    const userName = updatedReservation.reservedBy.firstName;

    await sendEmail(
    userEmail,
    "Your Reservation Status Has Been Updated",
    `
        <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        padding: 24px;
        background-color: #f9f9f9;
        color: #333;
        ">
        <h2 style="color: #16a34a;">Hello ${userName},</h2>

        <p>
            We wanted to let you know that your reservation has been updated.  
            Below are the details of your reservation:
        </p>

        <div style="
            background-color: #ffffff;
            padding: 16px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 5px solid #16a34a;
        ">
            <p><b>Reservation ID:</b> ${updatedReservation._id}</p>
            <p><b>Room ID:</b> ${updatedReservation.roomId || "N/A"}</p>
            <p><b>Date:</b> ${updatedReservation.date}</p>
            <p><b>Purpose:</b> ${updatedReservation.purpose}</p>
            <p><b>Status:</b> 
            <span style="color: ${
                updatedReservation.status === "accepted"
                ? "#16a34a"
                : updatedReservation.status === "rejected"
                ? "#dc2626"
                : "#d97706"
            };">
                ${updatedReservation.status.toUpperCase()}
            </span>
            </p>
        </div>

        <p>
            Thank you for using our reservation system.  
            If you have any questions, please contact the admin team.
        </p>

        <p style="
            color: gray;
            font-size: 14px;
            margin-top: 20px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        ">
            — Admin
        </p>
        </div>
    `
    );

    // 4️⃣ Respond with success
    res.status(200).json({
      message: "Reservation updated successfully.",
      success: true,
      data: updatedReservation,
    });

  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};


const getItemReservationsForNext7Days = async (req, res) => {
    // 1. Get roomId from query parameters (Standard for GET requests)
    const { itemId } = req.query; 

    // 2. Validate roomId presence
    if (!itemId) {
        return res.status(400).json({
            success: false,
            message: 'itemId is required in the query parameters.'
        });
    }

    try {
        // --- Date Calculation Logic ---
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today

        // Calculate the starting date string (Today)
        const todayString = formatDateToString(today);

        // Calculate 7 days from now (inclusive)
        const sevenDaysLater = new Date(today);
        sevenDaysLater.setDate(today.getDate() + 7);
        // We look for reservations up to the end of the 7th day, so we don't change the hours/minutes/seconds.

        // Calculate the *exclusive* string for the range
        const exclusiveEndString = formatDateToString(sevenDaysLater);

        // Mongoose query finds reservations that:
        // 1. Match the provided roomId
        // 2. Have a status of "Confirmed"
        // 3. Have a 'date' greater than or equal to today
        // 4. Have a 'date' less than the date 7 days from now (effectively including 7 days total)
        const data = await ItemReservation.find({
            itemId: itemId,
            status: "accepted", // Only "confirmed" reservations
            date: { 
                $gte: todayString,         // Start today (e.g., "2025-10-04")
                $lt: exclusiveEndString    // End before 7 days from today (e.g., "2025-10-11")
            }
        })
        .populate('reservedBy') // Populate the user details if needed
        .sort({ date: 1 }); // Sort by date and then starting time

        // console.log(data)

        const computedData = data.map(item => ({
            ...item._doc,
            hours: (item.outTime - item.startingTime + 1) / 2
        }))

        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No confirmed reservations found for this room in the next 7 days.'
            });
        }

        res.status(200).json({
            success: true,
            data: computedData
        })

    } catch (error) {
        console.error("Error fetching room reservations:", error.message);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching room reservations.'
        });
    }
}


module.exports = { 
    getUserReservations, 
    addReservation, 
    updateReservation,
    deleteReservation,
    getRoomReservationsForNext7Days,
    getAllReservation,
    updateSingleReservationAdmin,
    createReservation,
    getAllReservations,
    getItemReservationsForNext7Days,
    updateItemReservation
};