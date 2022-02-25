const mongoose = require('mongoose')
const { DateTime } = require("luxon");
const Schema = mongoose.Schema

const opts = { toJSON: { virtuals: true } };
const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    img_url: { type: String, required: true },
    following: { type: Array },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
}, opts)

// Virtual for date
UserSchema
  .virtual('date_formatted')
  .get(function () {
    return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED); // DateTime#toLocaleString 
});

UserSchema
  .virtual('date_formatted_simple')
  .get(function () {
    return DateTime.fromJSDate(this.createdAt).toLocaleString({ month: 'long', year: 'numeric' });
});

module.exports = mongoose.model('User', UserSchema);