const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  startLoacation: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    coordinates: [Number],
    address: String,
    description: String,
  },
  location: [
    {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      cordinates: [Number],
      address: String,
      description: String,
      day: Number,
    },
  ],
});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
