const User = require('../models/users.model');

//Get your profile
const getYourProfile = async (your_id) => {
    const your_profile = await User.findById(your_id).select('-accessToken -refreshToken -password');
    return your_profile;
};

//Get user's profile
const getUserProfile = async (user_id) => {
    const user_profile = await User.findById(user_id, {
        accessToken: false,
        refreshToken: false,
        createdAt: false,
        updatedAt: false,
        password: false,
    });
    return user_profile;
};

//Update user's information
    // Check username has already been used
const checkUsernameExisted = async (user_id, username) => {
    const username_checkedExisted = await User.find({
        $and: [
            {
                _id: { $nin: user_id }, 
            },
            {
                username: username
            }
        ]
    });
    return username_checkedExisted;
};
    //Update user's information
const updateUser = async (user_id, data) => {
    const user_updated = await User.findByIdAndUpdate(user_id, data, {
        new: true, //Get updated data
    }).select('-accessToken -refreshToken -password -code -createdAt -updatedAt');
    return user_updated;
}

//Upload user's avatar
const uploadUserAvatar = async (username, avatar) => {
    await User.findOneAndUpdate({
        username: username
    },{
        $set: {
            'avatar.public_id': avatar.public_id,
            'avatar.url': avatar.secure_url
        }
    });
}

const userService = {
    getYourProfile,
    getUserProfile,
    checkUsernameExisted,
    updateUser,
    uploadUserAvatar
};

module.exports = userService;