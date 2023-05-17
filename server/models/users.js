const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userModelSchema = new Schema({
  username: {
    type: String,
    required: [true, "no username given"],
  },
  email: {
    type: String,
    required: [true, "no email given"],
  },
  password: {
    type: String,
    required: [true, "no password given"],
  },
  reputation: {
    type: Number,
    default: 0,
  },
  accountCreationDate: {
    type: Date,
    default: Date.now,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

const userModel = mongoose.model("userModel", userModelSchema);
module.exports = userModel;
