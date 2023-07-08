const path = require('path');

const attachmentFilter = (req, file, cb) => {
    //Accept images and pdf only 
    const fileTypes = /pdf|jpeg|jpg|png/;
    //Check ext
    const extname = fileTypes.test(path.extname(file.originalname));
    //Check mimetype
    const mimetype = fileTypes.test(file.mimetype);

    if(mimetype && extname) {
        cb(null, true);
    } else {
        req.fileValidationError = 'Only pdf and images are allowed!';
        cb(null, false, req.fileValidationError);
    }
};

module.exports = attachmentFilter;
