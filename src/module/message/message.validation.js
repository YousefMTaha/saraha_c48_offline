import * as z from "zod";
import { validationFields } from "../../common/validation.js";
import { MessageFilterTypeEnum } from "../../common/enum/message.enum.js";

export const sendMessageSchema = (lang) => {
  return z
    .object({
      body: z.object({
        content: z.string().min(3).max(1000).optional(),
        receiverId: validationFields(lang).id,
      }),

      files: z.any().optional(),
    })
    .refine(
      (value) => {
        return value.body.content || value.files?.length;
      },
      {
        error: "You need to send at least content",
      },
    );
};

export const deleteMessageSchema = (lang) => {
  return z.object({
    params: z.object({ messageId: validationFields(lang).id }),
  });
};
export const getOneMessageSchema = (lang) => {
  return z.object({
    params: z.object({ messageId: validationFields(lang).id }),
  });
};
export const getAllMessagesSchema = (lang) => {
  return z.object({
    query: z.object({
      page: z.coerce.number().min(1).max(99).default(1),
      limit: z.coerce.number().min(1).max(99).default(5),
      filterType: z.literal(Object.values(MessageFilterTypeEnum)).optional(),
    }),
  });
};
