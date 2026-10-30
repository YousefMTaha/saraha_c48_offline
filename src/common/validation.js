import * as z from "zod";
import { GenderEnum } from "./enum/user.enum.js";
import { SystemLanguageEnum } from "./enum/system.enum.js";
import { Types } from "mongoose";

export const validationFields = (lang) => {
  return {
    username: z.string().min(2).max(20), // First Last
    email: z.email({
      error:
        lang == SystemLanguageEnum.EN
          ? "Email Must Follow This Pattern email@domain.com"
          : "يجب أن يتبع البريد الإلكتروني هذا النمط email@domain.com",
    }),
    password: z
      .string()
      .regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&* ]).{8,16}$/g),
    phone: z.e164(),
    gender: z.literal(Object.values(GenderEnum)),
    DOB: z.date(),
    otp: z.string().regex(/^\d{6}$/),
    id: z.string().refine(
      (value) => {
        return Types.ObjectId.isValid(value);
      },
      { error: "Invalid ObjectId" },
    ),
  };
};
