import multer from "multer";
import path from "path";

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "./uploads/users");
  },
  filename: function (req, file, cb) {
    cb(null, "user" + "-" + Date.now() + path.extname(file.originalname));
  },
});

// File filter configuration
const fileFilter = (req, res, cb) => {
  cb(null, true);
};

// Configure and export the multer upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export default upload.single("image");
