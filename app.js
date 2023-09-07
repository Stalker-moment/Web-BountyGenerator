const express = require('express');
const multer = require('multer');
//const fetch = require('node-fetch');
const axios = require('axios')
const { createCanvas, loadImage, registerFont } = require('canvas');

const app = express();
const port = 3000;

// Konfigurasi Multer untuk mengunggah gambar
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const arraynominal = ['1', '5', '10', '50', '100', '500', '1.000', '2.000', '3.000', '5.000', '10.000', '20.000', '30.000', '50.000', '100.000', '200.000', '300.000', '500.000', '1.000.000', '2.000.000', '3.000.000', '5.000.000']

app.use(express.static('public'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

function get_random(arraynya) {
    return arraynya[Math.floor(Math.random() * arraynya.length)];
  }

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/generate', upload.single('image'), async (req, res) => {
    const name = req.body.name
  try {
    // Baca gambar wanted_empty.png dari direktori public
    const background = await loadImage('./public/images/wanted_empty.png');

    // Konfigurasi ukuran canvas
    const canvas = createCanvas(background.width, background.height);
    const ctx = canvas.getContext('2d');

    // Gambar latar belakang
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    if (req.file) {
      // Jika gambar diunggah, baca gambar dari buffer
      registerFont('./fonts/OnePiece.ttf', { family: 'OnePiece' });
      const getprice = get_random(arraynominal)
      const uploadedImage = await loadImage(req.file.buffer);
      const clayTexture = await loadImage('./public/images/clay_texture.png');

      // Tentukan posisi dan ukuran gambar yang akan ditempelkan
      const x = 325;
      const y = 1060;
      const width = 2857;
      const height = 2070;

      ctx.font = '300px "OnePiece"'; // Menggunakan font lokal
      ctx.fillStyle = ctx.createPattern(clayTexture, 'repeat'); // Menggunakan tekstur tanah liat
      ctx.textAlign = 'center';
  
      // Teks 1
      ctx.fillText(name, canvas.width / 2, 3940);
  
      // Teks 2
      ctx.fillText(getprice, canvas.width / 2, 4440);
      // Tempelkan gambar ke canvas
      ctx.drawImage(uploadedImage, x, y, width, height);
    }

    // Kirim canvas sebagai gambar yang telah dihasilkan
    res.set('Content-Type', 'image/png');
    canvas.createPNGStream().pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan.');
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
