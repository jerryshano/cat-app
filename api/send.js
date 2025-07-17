import nodemailer from "nodemailer";
import formidable from "formidable";
import fs from "fs/promises";

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
      console.error("🛑 Form parse error:", err);
      res
        .status(500)
        .json({ message: "Error parsing form", details: err.message });
      return;
    }

    console.log("✅ Parsed fields:", fields);
    console.log("📎 Parsed files:", files);

    try {
      const subject = fields.subject || "No name provided";
      const message = fields.message || "No message provided";

      const uploadedFiles = Array.isArray(files.attachments)
        ? files.attachments
        : files.attachments
        ? [files.attachments]
        : [];

      // inside your handler function
      const attachments = await Promise.all(
        uploadedFiles.map(async (file) => {
          if (!file.filepath) {
            console.warn("Missing filepath:", file);
            return null;
          }

          try {
            const buffer = await fs.readFile(file.filepath);
            return {
              filename: file.originalFilename || "attachment",
              content: buffer,
            };
          } catch (err) {
            console.error("Failed to read file:", file.filepath, err);
            return null;
          }
        })
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
        text: `Name: ${subject}\nMessage: ${message}`,
        html: `<p>Subject: ${subject}</p><p>Message: ${message}</p>`,
        attachments: attachments.filter(Boolean),
      });

      res.status(200).send("Email sent!");
    } catch (e) {
      console.error("SEND ERROR:", e);
      res.status(500).send("Internal Server Error: " + e.message);
    }
  });
}
