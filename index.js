const express = require("express");
const { DefaultDeserializer } = require("v8");

const app = express();

// Save an image
app.post("/image", function (req, res) {
  //Validate image size (32mb)
  //Create uuid
  // Save image in local filesystem
  // Save the image uuid and expired date in DB
  // respond with the image url
  // considerations
  // Temporary image route = images/tmp
  // User specific image route is  = images/users/username
});

app.get("/image/:imageName", function (req, res) {});

app.listen(3000);
