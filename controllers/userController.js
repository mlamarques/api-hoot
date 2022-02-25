var User = require('../models/user');
var Hoot = require('../models/hoot');
require('dotenv').config()
const { body,validationResult } = require('express-validator');
var async = require('async');
const { DateTime } = require("luxon");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Find username in db.
exports.username = function(req, res, next) {

    const reqLowercase = req.body.username.toLowerCase();

    User.findOne({ "lowercase_username": reqLowercase }, function (err, user) {
        if (err) { return next(err); }
        if (user) {
            return res.json({message: "User found", isFound: true, username: user.username})
        } else {
            return res.json({message: "User not found", isFound: false, status: 403})
        } 
    })
};

// Search users in db 
exports.usernames_search = function(req, res, next) {
    User.find({ 'username': {$regex: `^${req.body.term}`}}, 'username img_url')
        .sort([['username', 'ascending']])
        // .limit( 5 )
        .exec(function (err, list_users) {
            if (err) { return next(err); }
            //Successful
            res.json({list_users})
        })
}

// Password confirmation
exports.password = function(req, res, next) {

    User.findOne({username: req.body.username}, function (err, user) {
        if (err) { return next(err); }
        
        const { _id, username, img_url, following, likes } = user

        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {console.log(err);}
            if (result) {
              // passwords match! log user in
              jwt.sign({ username: user.username }, process.env.SECRET_ENV, { expiresIn: '24h'}, (err, token) => {
                
                return res.json({ message: "Auth Passed", token: token, _id, username, img_url, following, likes, match: true })
              })
            } else {
              // passwords do not match!
              return res.json({message: "Incorrect password", match: false})
            }
        })
    })
};

// Handle user create on POST.
exports.user_create_post = [
    // Validate and sanitize fields.
    body('username').trim().isLength({ min: 1 }).escape().withMessage('Username must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('password').trim().isLength({ min: 8 }).escape().withMessage('Password must be at least 8 characters.')
        .isAlphanumeric().withMessage('Password has non-alphanumeric characters.'),
    body('img_url').trim().isLength({ min: 40 }).withMessage('img url must exist'),
    body('createdAt').trim().isLength({ min: 1 }).escape().withMessage('Time not specified.'),
    body('updatedAt').trim().isLength({ min: 1 }).escape().withMessage('Update not specified.'),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors.
            return;
        }
        else {
            const reqLowercase = req.body.username.toLowerCase();
            // Data from form is valid.

            // Check if user exists
            User.findOne({ "lowercase_username": reqLowercase }, function (err, user, next) {
                if (err) { return next(err); }

                if (user) {
                    return res.json({ message: "User already exists"})
                } else {
                    // Create an User object with escaped and trimmed data.
                    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                        if (err) return next(err)
                        
                        const user = new User({
                            username: req.body.username,
                            password: hashedPassword,
                            img_url: req.body.img_url,
                            following: [],
                            followers: [],
                            likes: [],
                            createdAt: req.body.createdAt,
                            updatedAt: req.body.updatedAt
                        })
                        user.save(err => {
                            if (err) { 
                            return next(err);
                            }
                            res.json({message: "sign up complete"})
                        });
                    })
                }
            })
        }
    }
]

// User page
exports.user_page = function (req, res, next) {
    User.findOne({username: req.params.user}, function (err, user, next) {
        if (err) { return next(err)}

        if (!user) {
            return res.json({message: 'User dont exist'});
        }
        if (user) {
            const { _id, username, createdAt, img_url, following, following_count, followers_count, date_formatted, date_formatted_simple } = user
            // return res.json({ _id, username , createdAt, img_url })

            Hoot.find({ 'owner' : _id})
                .sort({ createdAt : -1 })
                .exec(function (err, list_hoots) {
                    if (err) { return next(err); }
                    //Successful
                    // const newList = list_hoots.map((item) => item = {...item, 'simple_date': item.date_formatted})
                    const newList = []
                    for (var i = 0; i < list_hoots.length; i++) {
                        const item = list_hoots[i]
                        const date = item.date_formatted
                        newList.push({...list_hoots[i]._doc, new_date: date})
                    }
                    return res.json({ _id, username , createdAt, img_url, following, following_count, followers_count, date_formatted, date_formatted_simple, newList })
                });
        }
    })
}

// User Feed
exports.user_feed_get = function (req, res, next) {
    User.findById(req.params.id)
        .exec(function (err, user) {
            Hoot.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "owner_info",
                    },
                },
                {
                    $unwind: "$owner_info",
                    
                },
                { "$project": {"owner": 1, "box_content": 1, "createdAt": 1, "likes_count": 1, "comments_count": 1, "owner_info.username": 1, "owner_info.img_url": 1}},
            ])
            .sort({ createdAt : -1 })
            .then((result) => {
                const tempArray = [];
                for (let i = 0; i < result.length; i++) {
                    if (user.following.includes(String(result[i].owner))) {
                        result[i].date_formatted = result[i].createdAt.toLocaleString(DateTime.DATE_MED);
                        tempArray.push(result[i])
                    }
                }
                res.json( { hoots: tempArray } )
              })
              .catch((error) => {
                console.log(error);
              });
        })
    
}

// Follow profile
exports.follow_profile_post = function(req, res, next) {
    const { userId, followId } = req.body

    async.parallel({
        // add userId to followId list of followers
        add_userId_followers: function(callback) {
            User.findOneAndUpdate( {_id: followId}, { $addToSet: { "followers": userId } }, { returnOriginal: false }, callback );
        },
        // add followId to following list
        add_followId_following: function(callback) {
            User.findOneAndUpdate( {_id: userId}, { $addToSet: { "following": followId } }, { returnOriginal: false }, callback );
        },
    }, function(err, results, next) {
        if (err) { return next(err); }

        res.json({ message: 'Following', following: results.add_followId_following.following });
    });
}

// Unfollow profile
exports.unfollow_profile_post = function(req, res, next) {
    const { userId, followId } = req.body

    async.parallel({
        // remove userId to followId list of followers
        remove_userId_followers: function(callback) {
            User.findOneAndUpdate( {_id: followId}, { $pull: { "followers": userId } }, { returnOriginal: false }, callback );
        },
        // remove followId to following list
        remove_followId_following: function(callback) {
            User.findOneAndUpdate( {_id: userId}, { $pull: { "following": followId } }, { returnOriginal: false }, callback );
        },
    }, function(err, results, next) {
        if (err) { return next(err); }

        res.json({ message: 'Unfollowing', following: results.remove_followId_following.following });
    });
}

// Handle hoot like
exports.hoot_like_post = function (req, res, next) {
    const { userId, hootId } = req.body

    User.findById(userId)
        .exec(function (err, user, next) {
            if (err) { return next(err); }

            if (user.likes.includes(hootId)) {
                // async parallel
                async.parallel({
                    // remove hootId from likes
                    remove_from_likes: function(callback) {
                        // User.updateOne( {_id: userId}, { $pull: { likes: hootId } }, callback );
                        User.findOneAndUpdate( {_id: userId}, { $pull: { likes: hootId } }, { returnOriginal: false }, callback );
                    },
                    // hootId likesCount -1
                    hoot_count: function(callback) {
                        Hoot.updateOne( {_id: hootId}, { $inc: { likes_count: -1 } }, callback );
                    },
                }, function(err, results, next) {
                    if (err) { return next(err); }

                    res.json({ message: 'Like removed', user_likes: results.remove_from_likes.likes });
                });
                    
                    
            } else {
                async.parallel({
                    // Add hootId to likes
                    add_to_likes: function(callback) {
                        // User.updateOne( {_id: userId}, { $addToSet: { likes: hootId } }, callback );
                        User.findOneAndUpdate( {_id: userId}, { $addToSet: { likes: hootId } }, { returnOriginal: false }, callback );
                    },
                    // hootId likesCount +1
                    hoot_count: function(callback) {
                        Hoot.updateOne( {_id: hootId}, { $inc: { likes_count: +1 } }, callback );
                    },
                }, function(err, results, next) {
                    if (err) { return next(err); }



                    res.json({ message: 'Like added', user_likes: results.add_to_likes.likes });
                });
            }
        })
}

// TESTS

exports.test_get = function(req, res, next) {
    res.json({message: "ok"})
}

exports.test_post = function(req, res, next) {
    res.json({message: "ok"})
}

exports.test_list = function(req, res, next) {
    User.find()
        .exec(function(err, users) {
            if (err) { return next(err); }
            console.log(users[0])
            res.json({ users: users});
        })
}

