const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/users/"); // folder where images will be stored
  },
  filename: function (req, file, cb) {
    // rename the file with timestamp to avoid duplication
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});

// filtering file types 
function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image uploads are allowed"), false);
  }
}

const uploadUserFile = multer({ storage, fileFilter });
module.exports = {uploadUserFile}