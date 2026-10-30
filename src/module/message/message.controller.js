import { Router } from "express";
import auth from "../../middleware/authentication.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";
import uploadLocal from "../../common/utils/multer/multer.config.js";
import {
  deleteMessage,
  getAllMessage,
  getOneMessage,
  sendMessage,
} from "./message.service.js";
import { successResponse } from "../../common/response/success.response.js";
import validation from "../../middleware/validation.middleware.js";
import {
  deleteMessageSchema,
  getAllMessagesSchema,
  getOneMessageSchema,
  sendMessageSchema,
} from "./message.validation.js";

const messageRouter = Router();

messageRouter.post(
  "/send-message",
  (req, res, next) => {
    if (req.headers.authorization) {
      const authMiddleware = auth();
      return authMiddleware(req, res, next);
    }
    next();
  },
  upload({
    multerMiddleware: uploadLocal({
      customPath: "Message",
      maxFileSize: 100,
    }).any(),
    customPath: "Message",
  }),
  validation(sendMessageSchema),
  async (req, res) => {
    const result = await sendMessage(req.body, req.files, req.user);
    successResponse({ res, status: 201, data: result });
  },
);

messageRouter.delete(
  "/:messageId",
  auth(),
  validation(deleteMessageSchema),
  async (req, res) => {
    await deleteMessage(req.params.messageId, req.user);
    successResponse({ res });
  },
);

messageRouter.get(
  "/:messageId",
  auth(),
  validation(getOneMessageSchema),
  async (req, res) => {
    const result = await getOneMessage(req.params.messageId, req.user);
    successResponse({ res, data: result });
  },
);

messageRouter.get(
  "/",
  auth(),
  validation(getAllMessagesSchema),
  async (req, res) => {
    const result = await getAllMessage(req.validateData.query, req.user);
    successResponse({ res, data: result });
  },
);

export default messageRouter;
