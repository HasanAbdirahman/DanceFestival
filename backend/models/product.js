const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please fill this name with a valid"],
  },
  age: {
    type: Number,
    required: [true, "Please fill age"],
  },
  category: {
    type: String,
    required: [true, "Please select a category"],
    enum: ["solo", "duet", "trio", "groups"],
  },
});

module.exports = mongoose.model("Product", productSchema);
