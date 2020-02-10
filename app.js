const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));

const app = express();
const URI =
  "mongodb+srv://mark:Solode123@mongodb-qev5p.mongodb.net/test?retryWrites=true&w=majority";

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

app.use(
  session({
    secret: "Its me",
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
  })
);
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
