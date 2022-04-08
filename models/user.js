const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: [{ type: Schema.Types.ObjectId, ref: "role" }],
  permit: [{ type: Schema.Types.ObjectId, ref: "permit" }],
  created: { type: Date, default: Date.now() },
});

const user = mongoose.model("user", userSchema);

module.exports = user;
