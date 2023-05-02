const date = new Date(Date.now());
const formattedDate = date.toLocaleString();

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const answerModelSchema = new Schema({
    text: {
        type: String,
        required: [true, "no text given"]
    },
    ans_by: {
        type: String, 
        required: [true, "no ans_by string"]
    },
    ans_date_time: {
        type: Date,
        default: formattedDate
    },
    url: {
        type: String,
        default: "posts/answer/_id",
        immutable: true
    }
});

const answerModel = mongoose.model("answerModel", answerModelSchema);
module.exports = answerModel;