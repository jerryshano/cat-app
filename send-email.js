import nodemailer from "nodemailer";

export default async function sendEmail({ name, message, files = [] }) {
  const errors = [];
  if (!name) errors.push("Name is required");
  if (!message) errors.push("Message is required");
  if (errors.length > 0) throw new Error(errors.join(", "));

  const transporter = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "api",
      pass: "d7273794bad4bcbc221b618cc77af104",
    },
  });

  const attachments = files.map((file) => ({
    filename: file.originalname,
    content: file.buffer,
  }));

  await transporter.sendMail({
    from: '"SaveTheMeows" <no-reply@savethemeows.store>',
    to: ["jerry2dev@gmail.com", "kinanahamwi@yahoo.com"],
    cc: "quinleyslaw@yahoo.com",
    bcc: "mesv80@gmail.com",
    subject: "New email with attachments",
    text: `Name: ${name}\nMessage: ${message}`,
    html: `<p>Name: ${name}</p><p>Message: ${message}</p>`,
    attachments,
  });
}
