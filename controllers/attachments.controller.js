const fs = require('fs');
const mongoose = require('mongoose');
const multer = require('multer');

const Attachment = require('../models/attachments.model');
const attachmentService = require('../services/attachments.service');

const cloudinaryConfig = require('../configs/cloudinary');

//Add attachments
async function uploadAttachmentsToCloudinary(localFilePath){
    const path = localFilePath.split('\\').join('/');

    const mainFolderName = 'main';
    const filePathOnCloudinary = (mainFolderName + '/' + path).split('.')[0];

    try {
        // Upload image to cloudinary 
        const res = await cloudinaryConfig.uploader.upload(localFilePath, {
            public_id: filePathOnCloudinary,
        });

        // original_filename = project_id+_+original_name
        const original_filename = res.original_filename;
        const project_id = original_filename.split('_')[0];

        const attachment_info = {
            name: res.original_filename,
            type: res.format,
            size: (res.bytes /1000),
            uploadAt: res.created_at,
            public_id: res.public_id,
            url: res.secure_url,
            project: project_id
        };
        await attachmentService.addAttachment(attachment_info);

        //Remove local path
        fs.unlinkSync(localFilePath);
    } catch (error) {
        console.log(error);
    }
}

const addAttachments = async (req, res) => {
    try {
        const project_info = req.project_data;

        //Check allow files (pdf, images)
        if(req.fileValidationError) {
            return res.status(400).send({
                status: 'Failed',
                message: 'Only images and pdf files are allowed!'
            });
        }
        //Check empty files
        if(!req.files || !req.files.length) {
            return res.status(400).send({
                status: 'Failed',
                message: 'Empty files!'
            });
        }
        
        //Upload attachments
        const files_list = req.files;
        files_list.map(file => {
            //Upload attachment to cloudinary
            uploadAttachmentsToCloudinary(file.path);
        })

        res.status(200).send({
            status: 'Success',
            message: `Add attachments at project ${project_info._id} successfully!`
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

//Get attachments by project
const getAttachmentsByProject = async (req, res) => {
    try {
        const project_data = req.project_data;
        const currentPage = req.params.page;
        
        const attachments = await attachmentService.getAttachmentsByProject(project_data._id, currentPage);

        res.status(200).send({
            status: 'Success',
            message: `Get attachments by project ${project_data._id} successfully!`,
            ...attachments
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

//Remove attachment
const removeAttachment = async (req, res) => {
    try {
        const attachment_id = req.params.id;

        if(!mongoose.isValidObjectId(attachment_id)) {
            return res.status(400).send({
                status: 'Failed',
                message: 'Invalid attachment id value!'
            });
        }

        const attachment_removed = await attachmentService.removeAttachment(attachment_id);
        if(!attachment_removed) {
            return res.status(400).send({
                status: 'Failed',
                message: `Cannot find attachment with id ${attachment_id}!`
            });
        }
        //Remove attachment on cloudinary
        const file_publicId = attachment_removed.public_id;
        await cloudinaryConfig.uploader.destroy(file_publicId);

        res.status(200).send({
            status: 'Success',
            message: `Remove attachment with id ${attachment_id} successfully!`,
            data: attachment_removed
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        })
    }
}

const attachmentController = {
    addAttachments,
    getAttachmentsByProject,
    removeAttachment
}

module.exports = attachmentController;