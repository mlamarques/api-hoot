const mongoose = require('mongoose')
const { DateTime } = require("luxon");
const Schema = mongoose.Schema

const opts = { toJSON: { virtuals: true } };
const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    img_url: { type: String, required: true },
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'Hoot' }],
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
}, opts)

// Virtual for lowercase name
UserSchema
  .virtual('lowercase_username')
  .get(function () {
    return this.username.toLowerCase() || '';
});

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

// Virtual following count
UserSchema
  .virtual('following_count')
  .get(function () {
    return this.following ? this.following.length : 0;
});

// Virtual followers count
UserSchema
  .virtual('followers_count')
  .get(function () {
    return this.followers ? this.followers.length : 0;
});

module.exports = mongoose.model('User', UserSchema);