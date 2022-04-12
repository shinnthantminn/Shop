require("dotenv").config();
const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  fileUpload = require("express-fileupload");

mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);

app.use(express.json());
app.use(fileUpload());

const permitRouter = require("./routers/permit");
const roleRouter = require("./routers/role");
const userRouter = require("./routers/user");

app.use("/permit", permitRouter);
app.use("/role", roleRouter);
app.use("/user", userRouter);

app.get("*", (req, res, next) => {
  res.status(200).json({
    msg: "this route is not available in our server",
  });
});

app.use((err, req, res, next) => {
  err.status = err.status || 200;
  res.status(err.status).json({
    con: false,
    msg: err.message,
  });
});

const migration = require("./migration/migrator");

const setting = async () => {
  await migration.migrator();
  // await migration.backUp();
};

setting();

app.listen(process.env.PORT, () => {
  console.log(`i am running from http://127.0.0.1:${process.env.PORT}`);
});
