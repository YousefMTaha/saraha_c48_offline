import {
  processFields,
  processFile,
  processFiles,
} from "../common/utils/multer/multer.service.js";

export function checkFileContent({ acceptedFileType = [], customPath }) {
  return async (req, res, next) => {
    if (req.file) {
      await processFile({ file: req.file, acceptedFileType, customPath });
    } else if (Array.isArray(req.files)) {
      await processFiles({ files: req.files, acceptedFileType, customPath });
    } else if (req.files) {
      await processFields({ fields: req.files, acceptedFileType, customPath });
    }

    next();
  };
}

export function upload({ multerMiddleware, acceptedFileType, customPath }) {
  return async (req, res, next) => {
    return multerMiddleware(req, res, async (error) => {
      try {
        if (error) {
          next(error);
          return;
        }
        await checkFileContent({
          acceptedFileType,
          customPath,
        })(req, res, next);
      } catch (error) {
        next(error);
      }
    });
  };
}
