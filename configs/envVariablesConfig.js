require('dotenv').config();

const enviroment_variables = {
    server_port: process.env.SERVER_PORT || 8080,
    mongodb: {
        db_host: process.env.DB_HOST,
        db_port: process.env.DB_PORT,
        db_name: process.env.DB_NAME
    },
    auth: {
        access_token_secret: process.env.ACCESS_TOKEN_SECRET,
        refresh_token_secret: process.env.REFRESH_TOKEN_SECRET
    },
    cloudinary: {
        name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    },
    server_enviroment: process.env.SERVER_ENVIROMENT
}

module.exports = Object.freeze(enviroment_variables);