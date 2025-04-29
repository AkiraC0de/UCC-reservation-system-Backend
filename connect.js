const { MongoClient, ServerApiVersion } = require('mongodb');

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let database;

module.exports = {
    connectToDatabase: async () => {
        try {
            database = await client.db('ucc-reservation');
            console.log(" You successfully connected to MongoDB!");
        } catch (error) {
            console.error("Error message: ", error.message);
        }
    },
    getDb: () => {
        return database
    }
}