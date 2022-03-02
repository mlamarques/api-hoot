const mongoose = require('mongoose')
const { DateTime } = require("luxon");
const Schema = mongoose.Schema

const opts = { toJSON: { virtuals: true } };

const ContentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message:{ type: String, required: true, maxLength: 100 },
    createdAt: { type: Date, required: true },
})

const DirectMessageSchema = new Schema({
    party: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    updatedAt: {  type: Date, default: Date.now, required: true },
    content: [ContentSchema],
}, opts)

// Virtual for date
ContentSchema
  .virtual('date_formatted')
  .get(function () {
    return DateTime.fromJSDate(this.ContentSchema.createdAt).toLocaleString(DateTime.DATE_MED); // DateTime#toLocaleString 
});


module.exports = mongoose.model('DirectMessage', DirectMessageSchema);