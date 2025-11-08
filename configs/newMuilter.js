const multer = require("multer")
const path = require("path")


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/items/");  // folder where images will be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});


function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image uploads are allowed"), false);
  }
}

const uploadItemFile = multer({ storage });

module.exports = { uploadItemFile };
