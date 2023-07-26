const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const userService = require('../services/users.service');
const imageFilter = require('../helpers/imageFilter');
const cloudinaryConfig = require('../configs/cloudinary');

//Get your profile
const getYourProfile = async (req, res, next) => {
    try {
        const profile_data = req.user;
        const your_profile = await userService.getUserById(profile_data.id, 1);

        res.status(200).send({
            status: 'Success',
            message: `Get your profile's information successfully!`,
            data: your_profile
        });
    } catch (error) {
        next(error);
    }
}

// Get user's profile
const getUserProfile = async (req, res, next) => {
    try {
        const user_id = req.params.id;

        const user_profile = await userService.getUserById(user_id, 2);
        if(!user_profile) {
            return res.status(400).send({
                status: 'Failed',
                message: `Cannot find this user with id ${user_id}!`
            })
        }

        res.status(200).send({
            status: 'Success',
            message: `Get user'\s information by id ${user_id} successfully!`,
            data: user_profile
        });
    } catch (error) {
        next(error);
    }
};

//Update user's information
const updateUser = async (req, res, next) => {
    try {
        const user_id = req.params.id;
        const update_data = req.body;

        //Check body data is empty
        if(!Object.keys(update_data).length) {
            return res.status(400).send({
                status: 'Failed',
                message: 'No update information provided!'
            });
        }

        //Check username has already been used
        if(req.body.username) {
            const username_checkedExisted = await userService.checkUsernameExisted(user_id, req.body.username);
            if(username_checkedExisted.length != 0) {
                return res.status(400).send({
                    status: 'Failed',
                    message: 'This username has already been used!'
                });
            }
        }

        const user_updated = await userService.updateUser(user_id, update_data);
        if(!user_updated) {
            return res.status(400).send({
                status: 'Failed',
                message: `Cannot find user with id ${user_id}!`
            });
        }

        res.status(200).send({
            status: 'Success',
            message: `Update user'\s information by id ${user_id} successfully!`,
            data: user_updated
        });
    } catch (error) {
        next(error);
    }
};

//Upload user's avatar
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './storages/users');
    },
    filename: (req, file, cb) => {
        //Get payload from access token
        const token = req.headers.authorization.split(' ')[1];
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const name = `ava_${payload.username}`;
        //Change image's name
        cb(null, name + path.extname(file.originalname));
    }
});

async function uploadToCloudinary(localFilePath) {
    const path = localFilePath.split('\\').join('/');

    const mainFolderName = 'main';
    const filePathOnCloudinary = (mainFolderName + '/' + path).split('.')[0];

    try {
        // Upload image to cloudinary 
        const res = await cloudinaryConfig.uploader.upload(localFilePath, {
            public_id: filePathOnCloudinary,
        });
        const avatar_data = {
            'avatar.public_id': res.public_id,
            'avatar.url': res.secure_url
        };

        // original_filename = ava_[username]
        const original_filename = res.original_filename;
        const username = original_filename.split('_')[1];

        // Update user's avatar url
        await userService.uploadUserAvatar(username, avatar_data);
    } catch (error) {
        console.log(error);
    }
}

const uploadAvatar = async (req, res, next) => {
    try {
        const upload = multer({
            storage: storage,
            fileFilter: imageFilter
        }).single('avatar');
    
        upload(req, res, async (err) => {
            if(req.fileValidationError) {
                return res.status(400).send({
                    status: 'Failed',
                    message: 'Only images are allowed!'
                });
            } else if(!req.file) {
                return res.status(400).send({
                    status: 'Failed',
                    message: 'Please select an image to upload!'
                })
            } else if(err instanceof multer.MulterError) {
                return res.status(400).send({
                    status: 'Failed',
                    message: err
                });
            } else if(err) {
                return res.status(400).send({
                    status: 'Failed',
                    message: err
                });
            }
    
            const localFilePath = req.file.path;
            await uploadToCloudinary(localFilePath);
    
            fs.unlinkSync(localFilePath);
    
            res.status(200).send({
                status: 'Success',
                message: 'Avatar uploaded!'
            });
        })
    } catch (error) {
        next(error);           
    }
}

const userController = {
    getYourProfile,
    getUserProfile,
    updateUser,
    uploadAvatar
};

module.exports = userController;