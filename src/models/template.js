const mongoose = require("mongoose");

const templateSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  title: String,
  image: String, // url image for description
  description: String,
  creator: String, // member guild tag
  createdAt: {
    type: Number,
    default: () => Math.floor(Date.now() / 1000),
  },
  lang: {
    type: String,
    default: "fr",
  },
});

module.exports = mongoose.model("Template", templateSchema);
