const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is important!"],
    unique: true,
  },
  family: {
    type: String,
    required: [true, "family is important!"],
  },
  age: {
    type: Number,
    min: 18,
    max: 35,
  },
});

const Person = mongoose.model("Persons", personSchema);

module.exports = Person;
