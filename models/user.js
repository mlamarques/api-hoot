const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = mongoose.model(
    "User",
    new Schema({
        username: { type: String, required: true },
        password: { type: String, required: true },
        img_url: {type: String},
        createdAt: { type: Date, required: true },
        updatedAt: { type: Date, required: true }
    })
);

module.exports = User;