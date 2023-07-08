const multer = require('multer');
const fs = require('fs');

const attachmentFilter = require('../helpers/attachmentFilter');

const attachmentStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const project_data = req.project_data;
        const path = `./storages/projects/${project_data._id}/attachments`;
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: async (req, file, cb) => {
        const project_data = req.project_data;
        const name = project_data._id+'_'+file.originalname;
        cb(null, name);
    }
});

const fileSize = 1024 * 1024 * 10; //10mb

const uploadAttachments = multer({
    storage: attachmentStorage,
    fileFilter: attachmentFilter,
    limits: {
        fileSize: fileSize
    }
});

module.exports = uploadAttachments;