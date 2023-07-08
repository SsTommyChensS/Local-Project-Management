const path = require('path');

const imageFilter = (req, file, cb) => {
    //Accept images only
    const fileTypes = /jpeg|jpg|png/;
    //Check ext
    const extname = fileTypes.test(path.extname(file.originalname));
    //Check mimetype
    const mimetype = fileTypes.test(file.mimetype);

    if(mimetype && extname) {
        cb(null, true);
    } else {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
};

module.exports = imageFilter;
