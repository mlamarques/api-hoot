var User = require('../models/user');
require('dotenv').config()
const { body,validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Find username in db.
exports.username = function(req, res, next) {
    User.findOne({username: req.body.username}, function (err, user) {
        if (err) { return next(err); }
        
        if (user) {
            res.json({message: "User found", isFound: true})
        } else {
            return res.json({message: "User not found", isFound: false, status: 403, q: req.body})
        } 
    })
};

// Password confirmation
exports.password = function(req, res, next) {

    User.findOne({username: req.body.username}, function (err, user) {
        if (err) { return next(err); }
        
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {console.log(err);}
            if (result) {
              // passwords match! log user in
              jwt.sign({ username: user.username }, process.env.SECRET_ENV, { expiresIn: '24h'}, (err, token) => {
                return res.json({ message: "Auth Passed", token: token, match: true })
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
            // Data from form is valid.

            // Check if user exists
            User.findOne({username: req.body.username}, function (err, user) {
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

