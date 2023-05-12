const date = new Date(Date.now());

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentModelSchema = new Schema({
    text: {
        type: String,
        required: [true, "no text given"]
    },
    com_date_time: {
        type: Date,
        default: date
    },
    votes: {
        type: Number,
        default: 0
    },
    url: {
        type: String,
        default: "posts/comment/_id",
        immutable: true
    }
});

const commentModel = mongoose.model("commentModel", commentModelSchema);
module.exports = commentModel;