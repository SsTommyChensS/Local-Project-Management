const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullname: String,
    username: String,
    email: String,
    password: String,
    avatar: { 
        public_id: { type: String, default: ''},
        url: { type: String, default: ''}
    }, //Cloudinary image url
    email: String,
    age: Number,
    gender: Number,
    phone: String,
    address: String,
    code: { type: String, default: ''},
    accessToken: { type: String, default: ''},
    refreshToken: { type: String, default: ''},
}, {
    timestamps: true //createdAt, updatedAt
});

const User = mongoose.model('User', userSchema);

module.exports = User;