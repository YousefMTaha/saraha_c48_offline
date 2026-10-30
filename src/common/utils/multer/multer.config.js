import multer from "multer";
import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";

const uploadLocal = ({
  customPath,
  acceptedFileType = [],
  maxFileSize = 5,
}) => {
  // const storage = multer.diskStorage({
  //   destination: async (req, file, cb) => {
  //     const distPath = `./assets/${customPath}`;
  //     await mkdir(distPath, { recursive: true });
  //     cb(null, distPath);
  //   },
  //   filename: (req, file, cb) => {
  //     cb(null, randomUUID() + file.originalname);
  //   },
  // });
  const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    if (acceptedFileType.length && !acceptedFileType.includes(file.mimetype)) {
      cb(new Error("Invalid File Type", { cause: { statusCode: 400 } }));
      return;
    }
    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,

    limits: {
      fileSize: maxFileSize * 1024 * 1024,
    },
  });
};
export default uploadLocal;
