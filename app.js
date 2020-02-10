const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const URI =
  "mongodb+srv://Thinh:hihi192812@mongodb-qev5p.mongodb.net/test?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    console.log("start connect...");
    await mongoose.connect(URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
    console.log("db connected");
  } catch (error) {
    console.log("err", error);
  }
};

// Parse data
app.use(express.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + "/public"));

// view engine setup
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Route
const mainRoutes = require("./routes/index_route");
app.use(mainRoutes);

connectDB();

app.listen(3000, () => {
  console.log("Sever is running now at port 3000");
});
