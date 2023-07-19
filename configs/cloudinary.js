const cloudinary = require('cloudinary').v2;

const enviromentVariables = require('./envVariablesConfig');

cloudinary.config({
    cloud_name: enviromentVariables.cloudinary.name,
    api_key: enviromentVariables.cloudinary.api_key,
    api_secret: enviromentVariables.cloudinary.api_secret
});

module.exports = cloudinary;