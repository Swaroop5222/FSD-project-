
// const express = require('express');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const cors = require('cors');


// const app = express();
// app.use(express.json({ limit: '10mb' })); // support large base64 uploads
// app.use(cors());

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './images')
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname)
//     }
// })

// const upload = multer({ storage })

// const mongoURI = 'mongodb+srv://swaroop:swaroop5222@cluster0.tyf4ukm.mongodb.net/photosAppDB?retryWrites=true&w=majority';
// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
// const db = mongoose.connection;
// db.once('open', () => console.log('Connected to MongoDB Atlas photosAppDB'));

// const client = new OAuth2Client("YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com");

// // Album schema
// const albumSchema = new mongoose.Schema({
//     name: String,
//     uid: String,
//     createdAt: { type: Date, default: Date.now },
// });
// const Album = mongoose.model('Album', albumSchema);

// // Photo schema
// const photoSchema = new mongoose.Schema({
//     path: { type: String, required: true },
//     fileName: { type: String, required: true },
// });
// const Photo = mongoose.model('Photo', photoSchema);

// app.post("/single", upload.single("image"), async (req, res) => {
//     console.log(req.file)
//     try {
//         const { path, filename } = req.file
//         const photo = await new Photo({ path, fileName: filename })
//         await photo.save()
//         res.send({ "msg": "image uploaded" })
//     } catch (error) {
//         // res.status(500).send({ "error": "unable to upload image", details: error.message });
//         res.status(500).send({ "error": "unable to upload image", details: error.message });
//     }
// })

// // Create album
// app.post('/albums', async (req, res) => {
//     const { name, uid } = req.body;
//     try {
//         if (!name || !uid) return res.status(400).json({ error: 'name and uid required' });
//         const album = new Album({ name, uid });
//         await album.save();
//         res.json(album);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Get albums for user
// app.get('/albums/:uid', async (req, res) => {
//     try {
//         const albums = await Album.find({ uid: req.params.uid }).sort({ createdAt: -1 });
//         res.json(albums);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Delete album and related photos
// app.delete('/albums/:albumId', async (req, res) => {
//     try {
//         await Photo.deleteMany({ albumId: req.params.albumId });
//         await Album.deleteOne({ _id: req.params.albumId });
//         res.json({ message: 'Album and its photos deleted' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require("path")
const app = express();

app.use(express.json({ limit: '10mb' })); // support large base64 uploads
// app.use(express.static("images"))
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(
    cors({
        origin: 'http://localhost:3000', // update for your frontend
        credentials: true,
    })
);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage });

const mongoURI = 'mongodb+srv://swaroop:swaroop5222@cluster0.tyf4ukm.mongodb.net/photosAppDB?retryWrites=true&w=majority';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => console.log('Connected to MongoDB Atlas photosAppDB'));

// Album schema
const albumSchema = new mongoose.Schema({
    name: String,
    createdAt: { type: Date, default: Date.now },
});
const Album = mongoose.model('Album', albumSchema);

// Photo schema: link photo to album using albumId
const photoSchema = new mongoose.Schema({
    path: { type: String, required: true },
    fileName: { type: String, required: true },
    albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true },
});
const Photo = mongoose.model('Photo', photoSchema);

// Create album (single user: no uid)
app.post('/albums', async (req, res) => {
    const { name } = req.body;
    try {
        if (!name) return res.status(400).json({ error: 'name is required' });
        const album = new Album({ name });
        await album.save();
        res.json(album);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all albums
app.get('/albums', async (req, res) => {
    try {
        const albums = await Album.find().sort({ createdAt: -1 });
        res.json(albums);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Upload photo to a specific album
app.post('/albums/:albumId/photos', upload.single('image'), async (req, res) => {
    try {
        const albumId = req.params.albumId;
        const album = await Album.findById(albumId);
        if (!album) return res.status(404).send({ error: 'Album not found' });

        const { path, filename } = req.file;
        const photo = new Photo({
            path,
            fileName: filename,
            albumId: album._id,
        });
        await photo.save();
        res.send({ msg: 'Photo uploaded to album', photo });
    } catch (error) {
        res.status(500).send({ error: 'Unable to upload photo', details: error.message });
    }
});

// Delete photo by ID
app.delete('/photos/:photoId', async (req, res) => {
    try {
        const photo = await Photo.findByIdAndDelete(req.params.photoId);
        if (!photo) return res.status(404).send({ error: 'Photo not found' });
        res.send({ msg: 'Photo deleted' });
    } catch (error) {
        res.status(500).send({ error: 'Unable to delete photo', details: error.message });
    }
});

// Get all photos (at application startup or anytime)
app.get('/photos', async (req, res) => {
    try {
        const photos = await Photo.find().populate('albumId', 'name');
        res.json(photos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get photos for a specific album
app.get('/albums/:albumId/photos', async (req, res) => {
    try {
        const photos = await Photo.find({ albumId: req.params.albumId });
        res.json(photos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete album and its photos
app.delete('/albums/:albumId', async (req, res) => {
    try {
        await Photo.deleteMany({ albumId: req.params.albumId });
        await Album.deleteOne({ _id: req.params.albumId });
        res.json({ message: 'Album and its photos deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/albums/:albumId/images/:filename', (req, res) => {
    console.log("Fetching image");
    const filename = req.params.filename;
    const options = {
        root: path.join(__dirname, 'images'),
    };
    res.sendFile(options.root + '/' + filename, (err) => {
        if (err) {
            res.status(404).send('Image not found');
        }
    });
});

app.get('\\*', (req, res) => {
    res.status(404).send('Endpoint not found');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
