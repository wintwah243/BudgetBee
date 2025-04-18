const multer = require("multer");
const { storage } = require("../config/cloudinary"); 

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only .jpeg, .jpg and .png formats are allowed.'), false);
    }
};

const upload = multer({ storage, fileFilter }); 

module.exports = upload;
