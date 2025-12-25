const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        
        const allowedMimeTypes = /^image\/(jpeg|jpg|png|webp|gif)$/;
        const mimetype = allowedMimeTypes.test(file.mimetype);
        const extname = /\.(jpeg|jpg|png|webp|gif)$/i.test(file.originalname);

        if (mimetype && extname) {
            return cb(null, true);
        }
        console.error(`❌ File rejected: ${file.originalname}, MIME: ${file.mimetype}`);
        cb(new Error("Error: File upload only supports images!"));
    },
});

module.exports = upload;
