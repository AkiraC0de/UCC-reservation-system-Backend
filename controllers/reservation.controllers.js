const database = require('../connect');

const reservationGetController = async (req, res, next) => {
    const db = database.getDb();
    
    try {
        const data = await db.collection('reservations').find({}).toArray();

        //Check if the reservation collection is empty before sending datas
        if(data.length === 0){
            res.status(200).json({
                success: true,
                message: "Reservation has no content",
                data: [],
            })
        } else {
            res.status(200).json({
                success: true,
                data: data,
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while fetching reservations'
        });
    }
    
    //proceed to next middleware
    next();
}

const reservationPostController = async (req, res, next) => {
    const db = database.getDb();
    
    try {
        const dataNow = new Date().toISOString();
        const user = req.body.user || {};

        const mongoObject = {
            roomId: req.body.roomId || "",
            date: req.body.date || "",
            startTime: req.body.startTime || "",
            endTime: req.body.endTime || "",
            status: req.body.status || "pending",
            purpose: req.body.purpose || "",
            user: {
                userId: user.user_id || "",
                firstname: user.firstname || "",
                lastname: user.lastname || "",
                program: user.program || "",
                year: user.year || 1,
                section: user.section || ""
            },
            createdAt: dataNow,
            updateAt: dataNow,
        };

        //const data = await db.collection('reservations').insertOne(mongoObject);
        res.status(201).json({
            success: true,
            message: `The Reservation ${req.params.id} has been created.`, 
            data: mongoObject
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Server Error: Reservation ${req.params.id} cannot be sent.`
        })
    }

    //Proceed to middleware
    next();
}

const reservationPutController = async (req, res) => {
    const db = database.getDb();
    
    try {
        const findData = await db.collection('reservations').findOne({_id: new ObjectId(req.params.id)});

        if(!findData) {
            return res.status(404).json({
                success: false,
                message: `The Reservation ${req.params.id}} is not existed`
            })
        }

        const dataNow = new Date().toISOString();
        const user = req.body.user || {};

        const mongoObject = {
            $set: {
                roomId: req.body.roomId || findData.roomId,
                date: req.body.date || findData.date,
                startTime: req.body.startTime || findData.startTime,
                endTime: req.body.endTime || findData.endTime,
                status: req.body.status || findData.status,
                purpose: req.body.purpose || findData.purpose,
                user: {
                    userId: user.user_id || findData.user.userId,
                    firstname: user.username || findData.user.firstname,
                    lastname: user.lastname || findData.user.lastname,
                    program: user.program || findData.user.program,
                    year: user.year || findData.user.year,
                    section: user.section || findData.user.section
                },
                updatedAt: dataNow
            }
        };

        const data = await db.collection('reservations').updateOne({_id: new ObjectId(req.params.id)}, mongoObject);
        res.status(200).json({
            success: true,
            message: `The Reservation ${req.params.id} has been updated.`, 
            data: data
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Server Error: Reservation ${req.params.id} cannot be updated.`,
            data
        })
    }
} 

const reservationDeleteController = async (req, res) => {
    const db = database.getDb();
    try {
        const findData = await db.collection('reservations').findOne({_id: new ObjectId(req.params.id)});

        if(!findData){
            return res.status(404).json({
                success: false,
                message: `The Reservation ${req.params.id} is not existed` 
        })
        }

        const data = await db.collection("reservations").deleteOne({_id: new ObjectId(req.params.id)})
        res.status(200).json({
            success: true,
            message: `The reservation ${req.params.id} has been deleted`,
            data
        })
    } catch (error) {
        res.status(500).json({message: `Server Error: Reservation ${req.params.id} cannot be deleted.`, data})
    }
}

module.exports = { 
    reservationGetController, 
    reservationPostController, 
    reservationPutController,
    reservationDeleteController 
};