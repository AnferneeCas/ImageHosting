const express = require("express");
const { DefaultDeserializer } = require("v8");
const mongoose = require("mongoose");
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

// Save an image
app.post("/image", async function (req, res) {
  //Validate image size (32mb)
  //Create uuid
  // Save image in local filesystem
  // Save the image uuid and expired date in DB
  const uuid = uuidv4();
  const Image = mongoose.model("Image");
  var tmpImage = await Image.create({ name: uuid, expireDate: Date.now() });
  console.log("imagen creada");
  res.send(tmpImage);
  // respond with the image url
  // considerations
  // Temporary image route = images/tmp
  // User specific image route is  = images/users/username
});

app.get("/image/:imageName", async function (req, res) {
  const Image = mongoose.model("Image");
  const tmpImage = await Image.findOne({ name: req.params.imageName });
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
