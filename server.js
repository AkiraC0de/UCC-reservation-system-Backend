const express = require('express');
const database = require('./connect')

const app = express();

app.use(express.json());


app.listen(process.env.PORT, () => {
    database.connectToDatabase();
    console.log('server is running at PORT: ', process.env.PORT)
})