const mongoose = require('mongoose')
const { DateTime } = require("luxon");
const Schema = mongoose.Schema

const opts = { toObject: { virtuals: true }, toJSON: { virtuals: true } };
const HootSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    box_content: {
        type: String,
        required: true,
        maxLength: 100,
    },
    likes_count: {type: Number},
    comments_count: {type: Number},
    createdAt: { type: Date, default: Date.now}
}, opts)

// Virtual for date
HootSchema
  .virtual('date_formatted')
  .get(function () {
    return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED); // DateTime#toLocaleString 
});

module.exports = mongoose.model('Hoot', HootSchema);