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

const dir = path.join(__dirname + "/public/img/")
const app = express();

/* Middlewares */
app.use(express.json({ limit: "32mb" }));
app.use(express.static(__dirname + "/public"));
// Save an image
app.post("/image", async (req, res) => {

  const { file,format, user} = req.body;
  //Save image in local 
  const uuid = uuidv4();
  let ReadableStream = require("stream").Readable;
  const imageBufferData = Buffer.from(file, "base64");
  let streamObjet = new ReadableStream();
  streamObjet.push(imageBufferData);
  streamObjet.push(null);
  streamObjet.pipe(fs.createWriteStream(`${dir}${uuid}.${format}`));

  // Save the image uuid and expired date in DB
  const Image = mongoose.model("Image");
  // Date.Now plus 15days (15*24*60*60*1000)
  var tmpImage = await Image.create({
    name:`${uuid}.${format}`,
    expireDate: Date.now() + 15 * 24 * 60 * 60 * 1000,
  });
  console.log(`imagen creada ${tmpImage} `);
  res.send({url:`${req.protocol}://${req.headers.host}/img/${tmpImage.name}`})
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

app.get("/images/:imageName", async function (req, res) {
  // const Image = mongoose.model("Image");
  // console.log(req.hostname);
  // const tmpImage = await Image.findOne({ name: req.params.imageName });
  // if (tmpImage) {
    // retorna el ARCHIVO de la imagen.
    res.status(200).sendFile(path.join(__dirname + "/images/" + req.params.imageName));
  // } else {
  //   res.redirect("http://www.google.com");
  // }
});

app.listen(3000);
