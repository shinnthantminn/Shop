require("dotenv").config();
const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  fileUpload = require("express-fileupload"),
  cors = require("cors"),
  Port = process.env.PORT || 3000,
  url = `mongodb://127.0.0.1:27017/${process.env.DB_NAME}`;

mongoose.connect(url);

app.use(fileUpload());
app.use(express.json());
app.use(cors());

const permitRouter = require("./routers/permit");
const roleRouter = require("./routers/role");
const userRouter = require("./routers/user");
const { migrator, backup } = require("./migrations/migrator");

app.use("/permit", permitRouter);
app.use("/role", roleRouter);
app.use("/user", userRouter);

app.get("*", (req, res, next) => {
  res.status(200).json({
    msg: "this route is no Valid in our server",
  });
});

app.use((err, req, res, next) => {
  err.status = err.status || 200;
  res.status(err.status).json({
    con: false,
    msg: err.message,
  });
});

const migration = async () => {
  await migrator();
  // await backup();
};

migration();

app.listen(Port, () => {
  console.log(`server running from http://127.0.0.1:${Port}`);
});
