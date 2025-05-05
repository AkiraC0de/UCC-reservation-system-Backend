const mongoose = require('mongoose');

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.URI);
        console.log('Succesfully connected to MongoDb - Database')
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    connectToDatabase
}