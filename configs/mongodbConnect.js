const enviromentVariables = require('./envVariablesConfig');

const mongoose = require('mongoose');

module.exports = async function connect() {
    //Read db environments
    const db_host = enviromentVariables.mongodb.db_host;
    const db_port = enviromentVariables.mongodb.db_port;
    const db_name = enviromentVariables.mongodb.db_name;

    try {
        await mongoose.connect(`mongodb://${db_host}:${db_port}/${db_name}`);
        console.log('Connect to MongoDB server successfully!');
    } catch (error) {
        console.log('Error when connecting to MongoDB server!', error);
    }
}