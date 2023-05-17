const date = new Date(Date.now());

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const answerModelSchema = new Schema({
  aid: {
    type: String,
    required: [true, "no id given"],
  },
  text: {
    type: String,
    required: [true, "no text given"],
  },
  ans_by: {
    type: String
  },
  ans_date_time: {
    type: Date,
    default: date,
  },
  votes: {
    type: Number,
    defualt: 0,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "commentModel",
      default: [],
    },
  ],
  url: {
    type: String,
    default: "posts/answer/_id",
    immutable: true,
  },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const answerModel = mongoose.model("answerModel", answerModelSchema);
module.exports = answerModel;