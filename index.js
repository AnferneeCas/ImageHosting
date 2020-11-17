const express = require("express");
const os = require("os");
const path = require("path");
const { DefaultDeserializer } = require("v8");
const mongoose = require("mongoose");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

require("./schema");
mongoose.connect(
  "mongodb+srv://anfer2325:anfer2325@imagehosting.w5pxy.mongodb.net/ImageHosting?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }
);




const app = express();
const dir  = path.join(__dirname, "images");

/* Middlewares */
const middlewares = [
  express.json({ limit: "32mb" }),
  express.static(dir),
];
app.use(middlewares);

var mime = {
  html: 'text/html',
  txt: 'text/plain',
  css: 'text/css',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  js: 'application/javascript'
};

// Save an image
app.post("/image", async (req, res) => {
  // Vars
  const { file: imageBase64, user, format } = req.body;
  var hostname = os.hostname();
  const uuid = uuidv4();
  let ReadableStream = require("stream").Readable;
  const imageBufferData = Buffer.from(imageBase64, "base64");
  let streamObjet = new ReadableStream();

  let file = !user
    ? `/images/${uuid}.${format}`
    : /* check when i save a picture from a regitered  user  -------pending */
      `/images/users/${uuid}.${format}`;

  streamObjet.push(imageBufferData);
  streamObjet.push(null);
  streamObjet.pipe(fs.createWriteStream(`${__dirname}${file}`));

  //testing
  var fileTest = path.join(dir,`${uuid}.${format}`);
  var type = mime[path.extname(fileTest).slice(1)] || 'text/plain';
  console.log(path.extname(fileTest).slice(1) || 'text/plain');
  console.log(type);
  var s = fs.createReadStream(fileTest);
  s.on('open', function () {
      res.set('Content-Type', type);
      //the picture 
      s.pipe(res);
      
  });

  // // Save the image uuid and expired date in DB
  // const Image = mongoose.model("Image");
  // // Date.Now plus 15days (15*24*60*60*1000)
  // var tmpImage = await Image.create({
  //   name: uuid,
  //   expireDate: Date.now() + 15 * 24 * 60 * 60 * 1000,
  // });
  // console.log(`imagen creada ${tmpImage} `);
  

  // respond with the image url
  // considerations
  // Temporary image route = images/tmp
  // User specific image route is  = images/users/username
});

app.get("/image/:imageName", async function (req, res) {
  const Image = mongoose.model("Image");
  const tmpImage = await Image.findOne({ name: req.params.imageName });
  console.log(tmpImage);
  if (tmpImage) {
    //
    res.status(200).send({
      url: `localhost:3000/${tmpImage.name}`,
    });
  } else {
    res.status(400).send({
      message: "Not found",
    });
  }
});

app.get("/hosting/:imageName", async function (req, res) {
  const Image = mongoose.model("Image");
  const tmpImage = await Image.findOne({ name: req.params.imageName });
  if (tmpImage) {
    // retorna el ARCHIVO de la imagen.
    res.status(200).send(tmpImage);
  } else {
    res.redirect("http://www.google.com");
  }
});







app.listen(3000);
