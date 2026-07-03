import { Resend } from "resend";

let resend: Resend;

if (process.env.NODE_ENV === "production") {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  if (!global.resend) {
    global.resend = new Resend(process.env.RESEND_API_KEY);
  }
  resend = global.resend;
}

export default resend;
