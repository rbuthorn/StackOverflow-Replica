const date = new Date(Date.now());

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionModelSchema = new Schema({
  qid: {
    type: String,
    required: [true, "no id given"],
  },
  title: {
    type: String,
    requried: [true, "no title given"],
    maxLength: 100,
  },
  summary: {
    type: String,
    required: [true, "no summary given"],
  },
  text: {
    type: String,
    required: [true, "no text given"],
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "tagModel",
      default: [],
    },
  ],
  answers: [
    {
      type: Schema.Types.ObjectId,
      ref: "answerModel",
      default: [],
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "commentModel",
      default: [],
    },
  ],
  asked_by: {
    type: String,
    ref: "userModel",
  },
  ask_date_time: {
    type: Date,
    default: date,
  },
  views: {
    type: Number,
    default: 0,
  },
  votes: {
    type: Number,
    default: 0,
  },
  url: {
    type: String,
    default: "posts/question/_id",
    immutable: true,
  },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const questionModel = mongoose.model("questionModel", questionModelSchema);
module.exports = questionModel;
