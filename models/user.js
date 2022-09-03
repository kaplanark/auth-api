const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    isVeryfied: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        required: true,
        default:null
    },
    surname: {
        type: String,
        required: true,
        default:null
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
});

module.exports = mongoose.model("User", userSchema);