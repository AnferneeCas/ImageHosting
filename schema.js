const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Image = new Schema();

Image.add({
  name: {
    type: String,
    index: true,
  },
  expireDate: {
    type: Date,
  },
  views: {
    type: Number,
  },
});

Image.post("findOne", async function (result) {
  console.log(result);
  const tmpImage = await mongoose
    .model("Image")
    .findOneAndUpdate({ _id: result._id }, { $inc: { views: 1 } });
});

mongoose.model("Image", Image);
