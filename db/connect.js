require('dotenv').config();

const mongoose = require('mongoose');

module.exports = async function connect() {
    //Read db environments
    const db_host = process.env.DB_HOST;
    const db_port = process.env.DB_PORT;
    const db_name = process.env.DB_NAME;

    try {
        await mongoose.connect(`mongodb://${db_host}:${db_port}/${db_name}`);
        console.log('Connect to MongoDB server successfully!');
    } catch (error) {
        console.log('Error when connecting to MongoDB server!', error);
    }
}
