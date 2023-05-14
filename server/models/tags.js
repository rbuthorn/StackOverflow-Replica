const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagModelSchema = new Schema({
    tid: {
        type: String,
        required: [true, "no id given"]
    },
    name: {
        type: String,
        required: [true, "no name given"]
    },
    url: {
        type: String,
        default: "posts/tag/_id",
        immutable: true
    }
});

const tagModel = mongoose.model("tagModel", tagModelSchema);
module.exports = tagModel;