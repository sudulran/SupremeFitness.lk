// const multer = require("multer");
// const path = require("path");

// // Storage config
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/trainers"); // Save in uploads/trainers folder
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
//     );
//   },
// });

// // File filter (only images allowed)
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only .jpeg, .jpg, .png files are allowed!"));
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
// });

// module.exports = upload;
