import express from "express";
import multer from "multer";
import path from "path"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 8000;
const SERVER_URL = `http://localhost:${PORT}/`;

// Set up Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/'); // Set the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Set the file name to be unique
    }
});

const upload = multer({ storage: storage });

const app = express();


app.get(`/`, (req, res)=>{
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.post(`/single-image`,upload.single('image'), (req, res)=>{

    res.send('File uploaded successfully!');
})




app.listen(PORT, ()=>{
    console.log(`SERVER: ${SERVER_URL}`);
});
