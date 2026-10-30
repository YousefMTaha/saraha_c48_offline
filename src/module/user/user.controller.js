import { Router } from "express";
import { FileTypesEnum } from "../../common/enum/multer.enum.js";
import { TokenTypeEnum } from "../../common/enum/token.enum.js";
import { successResponse } from "../../common/response/success.response.js";
import uploadLocal from "../../common/utils/multer/multer.config.js";
import auth from "../../middleware/authentication.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";
import { logout, rotateToken, uploadProfilePic } from "./user.service.js";

const userRouter = Router({ caseSensitive: true, strict: true });

userRouter.get("/get-profile", auth(), async (req, res) => {
  successResponse({ res, data: { user: req.user, payload: req.payload } });
});

userRouter.post(
  "/upload-profile-pic",
  auth(),
  upload({
    multerMiddleware: uploadLocal({
      acceptedFileType: FileTypesEnum.images,
      maxFileSize: 100,
      customPath: "user",
    }).single("profile-pic"),
    acceptedFileType: FileTypesEnum.images,
    customPath: "user",
  }),
  async (req, res, next) => {
    await uploadProfilePic(req.user, req.file);
    successResponse({
      res,
      msg: "Uploaded",
    });
  },
);

userRouter.post(
  "/rotate-token",
  auth(TokenTypeEnum.REFRESH),
  async (req, res) => {
    const result = await rotateToken(req.payload);

    successResponse({ res, data: result });
  },
);

userRouter.post("/logout", auth(), async (req, res) => {
  const result = await logout(req.payload, req.user, req.body.action);

  successResponse({ res, data: result });
});

export default userRouter;
