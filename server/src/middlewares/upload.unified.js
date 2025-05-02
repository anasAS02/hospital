import multer from "multer";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      cb(null, UPLOAD_DIR);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const safeFilename = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, `${file.fieldname}-${uniqueSuffix}-${safeFilename}`);
  }
});

const createUploadMiddleware = ({ fieldName, fileType = 'image', maxFiles = 1 }) => {
  const fileFilter = (req, file, cb) => {
    if (fileType === 'image' && !file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed!'));
    } else if (fileType === 'pdf' && file.mimetype !== 'application/pdf') {
      cb(new Error('Only PDF files are allowed!'));
    } else if (fileType === 'all') {
      if (!file.mimetype.startsWith('image/') && file.mimetype !== 'application/pdf') {
        cb(new Error('Only image and PDF files are allowed!'));
      } else {
        cb(null, true);
      }
    } else {
      cb(null, true);
    }
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024, 
    },
  });

  const handleUpload = async (req, res, next) => {
    try {
      if (req.file) {
        const cloudinaryUrl = await uploadToCloudinary(req.file);
        req.file.cloudinaryUrl = cloudinaryUrl;
        await fs.unlink(req.file.path).catch(console.error);
      }
      
      if (req.files && Array.isArray(req.files)) {
        const uploadPromises = req.files.map(async (file) => {
          try {
            const cloudinaryUrl = await uploadToCloudinary(file);
            await fs.unlink(file.path).catch(console.error);
            return cloudinaryUrl;
          } catch (error) {
            console.error(`Error uploading file ${file.originalname}:`, error);
            await fs.unlink(file.path).catch(console.error);
            throw error;
          }
        });

        const results = await Promise.all(uploadPromises);
        req.files = req.files.map((file, index) => ({
          ...file,
          cloudinaryUrl: results[index]
        }));
      } else if (req.files && typeof req.files === 'object') {
        for (const field in req.files) {
          const files = req.files[field];
          const uploadPromises = files.map(async (file) => {
            try {
              const cloudinaryUrl = await uploadToCloudinary(file);
              await fs.unlink(file.path).catch(console.error);
              return cloudinaryUrl;
            } catch (error) {
              console.error(`Error uploading file ${file.originalname}:`, error);
              await fs.unlink(file.path).catch(console.error);
              throw error;
            }
          });

          const results = await Promise.all(uploadPromises);
          req.files[field] = files.map((file, index) => ({
            ...file,
            cloudinaryUrl: results[index]
          }));
        }
      }

      next();
    } catch (error) {
      console.error('File upload error:', error);
      if (req.file && req.file.path) {
        await fs.unlink(req.file.path).catch(console.error);
      }
      if (req.files) {
        const files = Array.isArray(req.files) 
          ? req.files 
          : Object.values(req.files).flat();
        
        await Promise.all(
          files
            .filter(file => file && file.path)
            .map(file => fs.unlink(file.path).catch(console.error))
        );
      }

      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to upload files to Cloudinary'
      });
    }
  };

  return [
    maxFiles === 1 ? upload.single(fieldName) : upload.array(fieldName, maxFiles),
    handleUpload
  ];
};

export { createUploadMiddleware };

export const uploadFiles = createUploadMiddleware({
  fieldName: 'pdfFiles',
  fileType: 'all',
  maxFiles: 5
});

export const uploadImage = createUploadMiddleware({
  fieldName: 'image',
  fileType: 'image',
  maxFiles: 1
});
