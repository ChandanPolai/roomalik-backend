const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v1: uuidv1 } = require('uuid');

exports.memoryUploader = multer({ storage: multer.memoryStorage() });

// exports.uploader = (folder) => {
//   // Ensure folder exists
//   if (!fs.existsSync(folder)) {
//     fs.mkdirSync(folder, { recursive: true });
//   }

//   let storage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, folder),
//     filename: (req, file, cb) => cb(null, uuidv1() + path.extname(file.originalname))
//   });

//   return multer({ storage: storage });
// };

//const chatMediaUploader = uploader('uploads/chat_media');

// Add file filter for chat media
const chatMediaFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|pdf|doc|docx|txt|m4a|mp3|wav/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('File type not allowed. Only images, videos, documents, and audio files are permitted'));
    }
};

exports.chatMediaUploader = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const folder = 'uploads/chat_media';
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder, { recursive: true });
            }
            cb(null, folder);
        },
        filename: (req, file, cb) => {
            cb(null, uuidv1() + path.extname(file.originalname));
        }
    }),
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    fileFilter: chatMediaFilter
});

exports.chatMediaUploaderArray = multer({
  storage: multer.diskStorage({
      destination: (req, file, cb) => {
          const folder = 'uploads/chat_media';
          if (!fs.existsSync(folder)) {
              fs.mkdirSync(folder, { recursive: true });
          }
          cb(null, folder);
      },
      filename: (req, file, cb) => {
          cb(null, uuidv1() + path.extname(file.originalname));
      }
  }),
  limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit per file
      files: 10 // Maximum 10 files at once
  },
  fileFilter: chatMediaFilter
});

exports.uploader = (folderName) => {
    return multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                const folderPath = path.join("uploads", folderName);
                if (!fs.existsSync(folderPath)) { fs.mkdirSync(folderPath, { recursive: true }); }
                cb(null, folderPath);
            },
            filename: function (req, file, cb) {
                const uniqueFilename = uuidv1() + path.extname(file.originalname);
                cb(null, uniqueFilename);
            },
        }),
    });
};