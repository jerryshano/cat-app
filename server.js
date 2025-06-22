import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import sendEmail from "./send-email.js";

const app = express();
const port = 3000;

const upload = multer({ storage: multer.memoryStorage() });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.post("/send", upload.array("attachments"), async (req, res) => {
  try {
    const emailData = {
      name: req.body.name,
      message: req.body.message,
      files: req.files,
    };

    await sendEmail(emailData);
    res.send("Email sent successfully!");
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Error: " + err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});