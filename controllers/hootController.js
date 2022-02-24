var Hoot = require('../models/hoot');
const { body,validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')

// Handle user create on POST.
exports.hoot_compose_post = [
    // Validate and sanitize fields.
    body('owner', 'Must have an user id').trim().isLength({ min: 1 }).escape(),
    body('box_content', 'Content must not be empty').trim().isLength({ min: 1 }).escape(),
    body('createdAt').trim().isLength({ min: 1 }).escape().withMessage('Time not specified.'),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
        var hoot = new Hoot(
          { owner: req.body.owner,
            box_content: req.body.box_content,
            likes_count: 0,
            comments_count: 0,
            createdAt: req.body.createdAt
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            return;
        }
        else {
            // Data from form is valid.
            hoot.save(function (err) {
                if (err) { return next(err); }
                   // Successful
                   res.json({message: "Hoot created"})
                });
        }
    }
]

// All user hoots
// exports.all_hoots_user = function (req, res, next) {
//     Hoot.find({ 'owner' : req.params.id})
//         .exec(function (err, list_hoots) {
//             if (err) { return next(err); }
//             //Successful, so render
//             if (list_hoots.length === 0) {
//                 return res.json({message: 'No hoots yet'});
//             }
//             return res.json({ list_hoots })
//         });
// }

