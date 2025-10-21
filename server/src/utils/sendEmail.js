import transporter from "../config/email.js";

export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Habbit Tracker <${process.env.EMAIL_USER}>"`,
      to,
      subject,
      html,
    });
    console.log(`Email Terkirim Ke: ${to}`);
  } catch (error) {
    console.error("Gagal mengirim email:", error);
  }
};
