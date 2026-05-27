// DEPENDENCIES
const { Schema, model } = require("mongoose");

// SCHEMA
const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// MODEL
const Project = model("Project", projectSchema);
module.exports = Project;