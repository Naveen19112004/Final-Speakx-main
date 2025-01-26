const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Question = require("./models/speakx.models");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "https://final-speakx-l8pe.onrender.com" }));

const uri = process.env.MONGO_URI;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database is connected"))
  .catch((err) => {
    console.error("Connection error:", err);
  });


app.get("/", (req, res) => {
  res.send("Welcome to the Question API!");
});

app.get("/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Question.countDocuments({
      title: { $regex: title, $options: "i" },
    });
    const pages = Math.ceil(total / limit);
    const questions = await Question.find({
      title: { $regex: title, $options: "i" },
    })
      .skip(skip)
      .limit(limit)
      .select("title type");

    res.json({ data: questions, page, pages });
  } catch (err) {
    res.status(500).json({ message: "Error fetching questions", error: err });
  }
});


const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
