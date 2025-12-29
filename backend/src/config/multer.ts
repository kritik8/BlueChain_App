// config/multer.ts
import multer from "multer";

// Use memory storage for files (buffers) to upload directly to services like ImageKit
const storage = multer.memoryStorage();

// Multer configuration
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Max file size: 5MB
  },
  fileFilter: (req, file, cb) => {
    // Allowed MIME types
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, JPEG, and PNG are allowed."));
    }
  },
});

export default upload;
