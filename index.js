import express from "express";
import multer from "multer";
import path from "path"
import { fileURLToPath } from "url";
import fs from "fs"
import sharp from "sharp";


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
  res.send("HELLO API WORKING")
})

app.get(`/single-image`,upload.single('image'), (req, res)=>{

  res.sendFile(path.join(__dirname, '/index.html'))
})




app.post(`/single-image`, upload.single('image'), async(req, res)=>{

  console.log(req.file)
  fs.access("./public", (error) => {
    if (error) {
      fs.mkdirSync("./public");
    }
  });
  const { buffer, originalname } = req.file;
  const timestamp = Date.now()
  const ref = `${timestamp}-${originalname.split('.')[0]}.webp`;
  await sharp(buffer)
    .webp({ quality: 20 })
    .toFile(`./public/${ref}`)
    .then(info => { console.log("Info: " + JSON.stringify(info, null, 2)) })
    .catch(err => { console.log("Error: " + err) });
  const link = `${SERVER_URL}${ref}`;
  return res.json({ link });
})




app.listen(PORT, ()=>{
    console.log(`SERVER: ${SERVER_URL}`);
});
