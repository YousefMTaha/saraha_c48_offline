import * as z from "zod";
import { validationFields } from "../../common/validation.js";

const loginSchemaBody = (lang) => {
  return z.object({
    email: validationFields(lang).email,
    password: validationFields(lang).password,
  });
};

// localization => translate
export const loginSchema = (lang) => {
  return z.object({
    body: loginSchemaBody(lang),
  });
};

export const signupSchema = (lang) => {
  return z.object({
    body: loginSchemaBody(lang)
      .extend({
        username: validationFields(lang).username,
        phone: validationFields(lang).phone,
        gender: validationFields(lang).gender.optional({}),
        DOB: validationFields(lang).DOB.optional(),
        confirmPassword: validationFields(lang).password,
      })
      .refine(
        (value) => {
          console.log({ value });

          return value.confirmPassword === value.password;
        },
        { error: "Confirm Password Miss Match Password" },
      ),
  });
};

export const confirmEmailSchema = (lang) => {
  return z.object({
    body: z.object({
      email: validationFields(lang).email,
      otp: validationFields(lang).otp,
    }),
  });
};
export const confirmForgetPasswordOTPSchema = confirmEmailSchema;

export const resetPasswordSchema = (lang) => {
  return z.object({
    body: z
      .object({
        email: validationFields(lang).email,
        otp: validationFields(lang).otp,
        password: validationFields(lang).password,
        confirmPassword: validationFields(lang).password,
      })
      .refine(
        (value) => {
          console.log({ value });

          return value.confirmPassword === value.password;
        },
        { error: "Confirm Password Miss Match Password" },
      ),
  });
};
export const resendSchema = (lang) => {
  return z.object({
    body: z.object({
      email: validationFields(lang).email,
    }),
  });
};

export const forgetPasswordSendOTPSchema = resendSchema;
