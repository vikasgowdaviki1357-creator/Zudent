import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDirectory = path.join(
  process.cwd(),
  "uploads",
  "marketplace"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

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
      .replace(
        /[^a-zA-Z0-9-_]/g,
        "_"
      );

    const uniqueName =
      `${originalName}-${Date.now()}-${Math.round(
        Math.random() * 100000
      )}${extension}`;

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
  ];

  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  if (
    !allowedExtensions.includes(
      extension
    )
  ) {
    return cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      ),
      false
    );
  }

  if (
    !file.mimetype.startsWith(
      "image/"
    )
  ) {
    return cb(
      new Error(
        "Only image files are allowed."
      ),
      false
    );
  }

  cb(null, true);
};

const uploadMarketplaceImages =
  multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
      files: 5,
    },
  });

export default uploadMarketplaceImages;