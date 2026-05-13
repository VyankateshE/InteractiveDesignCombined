const multer = require("multer");
const path = require('path');
const maxSize = 1 * 1024 * 1024; // for 1MB

const excelFilter = (req, file, cb) => {
    if (
        file.mimetype.includes("excel") ||
        file.mimetype.includes("spreadsheetml")
    ) {
        cb(null, true);
    } else {
        cb("Please upload only excel file.", false);
    }
};

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //console.log(__basedir);
        cb(null, path.join(global.__basedir, 'uploads/'));
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
    },
});
//console.log(storage);

// var uploadFile = multer({ storage: storage });
var uploadFile = multer({ storage: storage });
module.exports = uploadFile;