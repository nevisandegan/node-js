const { query } = require("express");
const Person = require("../models/personModel");
const catchAsync = require("../utils/catch-async");

exports.getPerson = catchAsync(async (req, res) => {
  const person = await Person.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: person,
  });
});

exports.top = (req, res, next) => {
  req.query.sort = "age";
  req.query.limit = "1";
  next();
};

exports.getPersonStat = async (req, res) => {
  try {
    const stat = await Person.aggregate([
      {
        $match: {
          age: { $gt: 18 },
        },
      },
      {
        $group: {
          _id: null,
          countPerson: { $sum: 1 },
          sumAge: { $sum: "$age" },
          maxAge: { $max: "$age" },
          minAge: { $min: "$age" },
          avrgAge: { $avg: "$age" },
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: stat,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getPersons = async (req, res) => {
  try {
    const obj = { ...req.query };
    const excluded = ["sort", "field", "page", "limit"];
    excluded.forEach((item) => delete obj[item]);

    const queryStr = JSON.stringify(obj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    let query = Person.find(JSON.parse(queryStr));

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");

      query = query.sort(sortBy);
    } else {
      query = query.sort("name");
    }

    if (req.query.sort) {
      const sortBy = req.query.field.split(",").join(" ");
      query = query.select(sortBy);
    } else {
      query = query.select("-__v");
    }
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numPerson = await Person.countDocuments();
      if (skip > numPerson) throw new Error("this page does not exist!");
    }

    const persons = await query;

    res.status(200).json({
      status: "success",
      data: persons,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      messge: err,
    });
  }
};

exports.createPerson = catchAsync(async (req, res) => {
  const newPerson = await Person.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      newPerson,
    },
  });
});

exports.updatePerson = async (req, res) => {
  try {
    const updatePerson = await Person.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: {
        updatePerson,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      messge: err,
    });
  }
};
exports.deletePerson = async (req, res) => {
  try {
    const deletePerson = await Person.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        deletePerson,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      messge: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Person.aggregate([]);
    res.status(200).json({
      status: "success",
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      messge: err,
    });
  }
};

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "category is important"],
  },
  price: {
    type: Number,
    required: [true, "price is important"],
  },
  quantity: {
    type: Number,
    required: [true, "quantity is important"],
  },
  soldDate: {
    type: Date,
    required: [true, "soldDate is important"],
  },
});

// const Products = mongoose.Model("Products", schema);

// exports.questionGpt = async (req, res) => {
//  const products=await Products.aggregate([
//   {
//     $match:{
//       soldDate:{$month:'$soldDate'}
//     },{
//       $group:{
//         category:"$category",
//         totalInCome:""
//       }
//     }
//   }
//  ])
// };
