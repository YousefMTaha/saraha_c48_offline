import { Router } from "express";
import { successResponse } from "../../common/response/success.response.js";
import validation from "../../middleware/validation.middleware.js";
import {
  confirmEmail,
  confirmForgetPasswordOTP,
  login,
  resendConfirmEmailOTP,
  resetPassword,
  sendForgetPasswordOTP,
  signup,
  signupOrLoginWithGoogle,
} from "./auth.service.js";
import {
  confirmEmailSchema,
  confirmForgetPasswordOTPSchema,
  forgetPasswordSendOTPSchema,
  loginSchema,
  resendSchema,
  resetPasswordSchema,
  signupSchema,
} from "./auth.validation.js";
const authRouter = Router();

authRouter.post("/signup", validation(signupSchema), async (req, res) => {
  const result = await signup(req.body);

  successResponse({ res, msg: "created", data: result, status: 201 });
});

authRouter.post("/login", validation(loginSchema), async (req, res) => {
  const result = await login(req.validateData.body);

  successResponse({ res, data: result });
});

authRouter.patch(
  "/confirm-email",
  validation(confirmEmailSchema),
  async (req, res) => {
    await confirmEmail(req.validateData.body);

    successResponse({ res });
  },
);

authRouter.post(
  "/confirm-forget-password-otp",
  validation(confirmForgetPasswordOTPSchema),
  async (req, res) => {
    await confirmForgetPasswordOTP(req.validateData.body);

    successResponse({ res });
  },
);

authRouter.post(
  "/resend-Confirm-Email-OTP",
  validation(resendSchema),
  async (req, res) => {
    const result = await resendConfirmEmailOTP(req.validateData.body.email);

    successResponse({ res, data: result });
  },
);

authRouter.patch(
  "/reset-password",
  validation(resetPasswordSchema),
  async (req, res) => {
    const result = await resetPassword(req.validateData.body);

    successResponse({ res, data: result });
  },
);

authRouter.post(
  "/send-Forget-Password-OTP",
  validation(forgetPasswordSendOTPSchema),
  async (req, res) => {
    await sendForgetPasswordOTP(req.validateData.body.email);

    successResponse({ res });
  },
);

authRouter.post("/login-with-gmail", async (req, res) => {
  const { tokens, statusCode } = await signupOrLoginWithGoogle(
    req.body.idToken,
  );
  successResponse({ res, status: statusCode, data: tokens });
});

export default authRouter;
