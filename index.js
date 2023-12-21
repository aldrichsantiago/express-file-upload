import express from "express";
import multer from "multer";
import path from "path"
import { fileURLToPath } from "url";
import fs from "fs"
import sharp from "sharp";
import dotenv from "dotenv"

dotenv.config({ path: __dirname+'/.env' });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 8000;
const SERVER_URL = `http://localhost:${PORT}/`;

// Set up Multer storage
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'public/'); // Set the destination folder for uploaded files
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname); // Set the file name to be unique
//     }
// });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const app = express();

app.use(express.static('public'))



app.get(`/`, (req, res)=>{
  res.sendFile(path.join(__dirname, '/index.html'))
})


app.get(`/test`,upload.single('image'), (req, res)=>{
  res.send("API IS WORKING!")
})


app.post(`/single-image`, upload.single('image'), async(req, res)=>{
  fs.access("./public", (error) => {
    if (error) {
      fs.mkdirSync("./public");
    }
  });

  if (!req.file) return res.json({ success: false, message: "There is no file" }).status(400)
  const { buffer, originalname } = req.file;
  const timestamp = Date.now()
  const ref = `${timestamp}-${originalname.split('.')[0]}.webp`;
  await sharp(buffer)
    .webp({ quality: 20 })
    .toFile(`./public/${ref}`)
    .then(info => { console.log("Info: " + JSON.stringify(info, null, 2)) })
    .catch(err => { console.log("Error: " + err) });
  const link = `${SERVER_URL}${ref}`;
  return res.json({ link, MESSAGE:"SAVE THESE LINKS!" });
})


app.listen(PORT, ()=>{
    console.log(`SERVER: ${SERVER_URL}`);
});
