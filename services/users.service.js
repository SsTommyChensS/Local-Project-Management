const User = require('../models/users.model');

//Add an user
const addUser = async (user_info) => {
    const user = new User({
        fullname: user_info.fullname,
        username: user_info.username,
        password: user_info.password,
        email: user_info.email,
        age: user_info.age,
        gender: user_info.gender,
        phone: user_info.phone,
        address: user_info.address,
        code: user_info.code,
    });
    await user.save();
};

//Update user by id
const updateUser = async (user_id, user_info) => {
    const user_updated = await User.findByIdAndUpdate(user_id, user_info, {
        new: true, //Get updated data
    }).select('-accessToken -refreshToken -password -code -createdAt -updatedAt');
    return user_updated;
};

//Get an user's information by id
const getUserById = async (user_id, option) => {
    let user_profile;
    switch (option) {
        case 1: { //Your profile
            user_profile = await User.findById(user_id).select('-accessToken -refreshToken -password');
            break;
        }
        case 2: { //User profile
            user_profile = await User.findById(user_id).select('-accessToken -refreshToken -password -createdAt -updatedAt -code');
            break;
        }
    }
    return user_profile;     
}

//Get an user's information by condition
const getUserByCondition = async (condition) => {
    const user_info = await User.findOne(condition);
    return user_info;
}

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
    addUser,
    getUserByCondition,
    getUserById,
    checkUsernameExisted,
    updateUser,
    uploadUserAvatar
};

module.exports = userService;