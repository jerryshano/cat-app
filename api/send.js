import nodemailer from "nodemailer";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const form = formidable({ multiples: true, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(400).send("Error parsing form");
    }

    try {
      const { name, message } = fields;
      const uploadedFiles = Array.isArray(files.attachments)
        ? files.attachments
        : files.attachments
        ? [files.attachments]
        : [];

      console.log("Uploaded Files:", uploadedFiles);

      const attachments = await Promise.all(
        uploadedFiles.map(async (file) => ({
          filename: file.originalFilename || "attachment",
          content: await file.toBuffer(), // 💥 This works in Vercel!
        }))
      );

      const transporter = nodemailer.createTransport({
        host: "live.smtp.mailtrap.io",
        port: 587,
        auth: {
          user: "api",
          pass: "d7273794bad4bcbc221b618cc77af104",
        },
      });

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

      res.status(200).send("Email sent!");
    } catch (e) {
      console.error(e);
      res.status(500).send("Internal Server Error");
    }
  });
}
