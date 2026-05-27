// DEPENDENCIES
const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// SCHEMA
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, "Must match an email address!"],
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
    },
});

// PRE-SAVE HOOK - Mongoose 9 async (no next parameter)
userSchema.pre("save", async function () {
    if (this.isNew || this.isModified("password")) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
});

// INSTANCE METHOD
userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

// MODEL
const User = model("User", userSchema);
module.exports = User;