const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Hoot = mongoose.model(
    "Hoot",
    new Schema({
        owner: { type: String, required: true },
        box_content: {
            type: String,
            required: true,
            maxLength: 100,
        },
        createdAt: { type: Date, default: Date.now}
    })
);

module.exports = Hoot;