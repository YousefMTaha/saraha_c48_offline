import {
  getEmailBannedKey,
  getEmailKey,
  getEmailTrialsKey,
  getValue,
  incrKey,
  isExists,
  setValue,
  ttlKey,
} from "../../cache.service.js";
import { BadRequestException } from "../../exceptions/app.exceptions.js";
import generateOTP from "../../otp.js";
import { hashValue } from "../../security/hash.js";
import transporter from "./email.config.js";
import { EmailTemplate } from "./email.template.js";

export async function sendMail({ to, cc, bcc, subject, html, attachments }) {
  try {
    const info = await transporter.sendMail({
      from: '"Example Team" <tyousef262@gmail.com>',
      to,
      cc,
      bcc,
      subject,
      html,
      attachments,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
}

export async function sendOTP({ email, subject }) {
  const otp = generateOTP();

  await sendMail({
    to: email,
    subject,
    html: EmailTemplate[subject](otp),
  });

  await setValue({
    key: getEmailKey(email, subject),
    value: await hashValue({ value: otp }),
    options: { expiration: { value: 180 } },
  });

  if (await isExists(getEmailTrialsKey(email, subject))) {
    await incrKey({ key: getEmailTrialsKey(email, subject) });
  } else {
    await setValue({
      key: getEmailTrialsKey(email, subject),
      value: 1,
      options: { expiration: { value: 30 * 60 } },
    });
  }
}

export async function checkSendOTP({ email, subject }) {
  const otpTTL = await ttlKey(getEmailKey(email, subject));

  if (otpTTL > 0) {
    throw BadRequestException({
      errMsg: `OTP Still valid, You Can try after ${otpTTL}s`,
    });
  }

  const isBanned = await isExists(getEmailBannedKey(email, subject));
  if (isBanned) {
    throw BadRequestException({ errMsg: `Please Try again later` });
  }

  const trials = await getValue(getEmailTrialsKey(email, subject));

  if (trials == 2) {
    await setValue({
      key: getEmailBannedKey(email, subject),
      value: 0,
      options: { expiration: { value: 30 * 60 } },
    });
  }
}
