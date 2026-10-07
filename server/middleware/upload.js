import multer from "multer";
import path from "path";
import fs from "fs";

/* =========================================================
   UPLOAD DIRECTORY
   ========================================================= */

const uploadDirectory = path.join(
  process.cwd(),
  "uploads",
  "resources"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

/* =========================================================
   STORAGE
   ========================================================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname
    );

    const originalName = path
      .basename(
        file.originalname,
        extension
      )
      .replace(/[^a-zA-Z0-9-_]/g, "_");

    const uniqueName =
      `${originalName}-${Date.now()}${extension}`;

    cb(null, uniqueName);
  },
});

/* =========================================================
   FILE FILTER
   ========================================================= */

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [
    ".pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
  ];

  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    return cb(
      new Error(
        "Only PDF, DOC, DOCX, PPT and PPTX files are allowed."
      ),
      false
    );
  }

  cb(null, true);
};

/* =========================================================
   MULTER
   ========================================================= */

const uploadResourceFile = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export default uploadResourceFile;