const date = new Date(Date.now());

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionModelSchema = new Schema({
    qid: {
        type: String,
        required: [true, "no id given"]
    },
    title:{
        type: String,
        requried: [true, "no title given"],
        maxLength: 100
    },
    text: {
        type: String,
        required: [true, "no text given"]
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: "tagModel"
    }],
    answers: [{
        type : Schema.Types.ObjectId,
        ref: "answerModel"
    }],
    asked_by: {
        type: String, 
        default: "Anonymous"
    },
    ask_date_time: {
        type: Date,
        default: date
    },
    views: {
        type: Number,
        default: 0
    },
    url: {
        type: String,
        default: "posts/question/_id",
        immutable: true
    }
});

const questionModel = mongoose.model("questionModel", questionModelSchema);
module.exports = questionModel;