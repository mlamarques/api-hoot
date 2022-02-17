const mongoose = require('mongoose')
const { DateTime } = require("luxon");
const Schema = mongoose.Schema

const HootSchema = new Schema({
    owner: { type: String, required: true },
    box_content: {
        type: String,
        required: true,
        maxLength: 100,
    },
    createdAt: { type: Date, default: Date.now}
})

// Virtual for date
HootSchema
  .virtual('date_formatted')
  .get(function () {
    return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED); // DateTime#toLocaleString 
});

module.exports = mongoose.model('Hoot', HootSchema);