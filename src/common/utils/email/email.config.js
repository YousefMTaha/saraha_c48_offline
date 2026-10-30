import { createTransport } from "nodemailer";
import { EMAIL_PASSWORD, EMAIL_USER } from "../../../config/config.js";
const transporter = createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});
export default transporter;
