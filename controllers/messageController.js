var DirectMessage = require('../models/direct_message');
var User = require('../models/user');
const { body,validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')

exports.messages_post = async function(req, res, next) {
    

    // Get all messages from user
    DirectMessage.find({ party: { $in: req.body.userId } })
        .populate(
            {
            path : 'party',
            select: 'username img_url',
            // populate : {
            //     path : 'content',
            // },
        },
        )
        .sort({ updatedAt : -1 })
        .exec(function(err, messages) {
            if (err) { return next(err)}

            if (messages) {
                return res.json({messages})
            }
        })

    



    // var message = new DirectMessage(
    //     { 
    //         party: [user1, user2],
    //         updatedAt: new Date(),
    //         content: [
    //             {
    //                 userId: user1,
    //                 message: 'huba huba huabasdasd',
    //                 createdAt: new Date()
    //             }
    //         ]
    //     });

    //     message.save(function (err) {
    //         if (err) { return next(err); }
    //            // Successful
    //            console.log('message created')
    //         });
}

exports.chat_with_user_get = async function (req, res, next) {
    const authHeaders = req.headers.authorization;
    const [,token] = authHeaders.split(" ");
    const users = req.params.id.split('-')
    const [ user1, user2] = users

    
    const decoded = jwt.verify(token, process.env.SECRET_ENV, (err, authData) => {
        if (err) {
            return ''
        }
        // res.json({tokenMatch: true, authData, token})
        return authData
    })

    const otherUser = user1 === decoded._id ? user2 : user1

    // Check if there is any direct_message with users
    DirectMessage.find({
        $and: [
            { party: user1 },
            { party: user2 },
        ] 
    })
    .populate(
        {
        path : 'party',
        select: 'username img_url',
        // populate : {
        //     path : 'content',
        // },
    },
    ).exec(function(err, messages) {
        if (err) { return  res.json({message: 'not found'})}

        if (messages) {
            if (messages.length === 0) {
                User.findById(otherUser, '_id username img_url')
                    .exec(function(err, user) {
                        if (err) { return  res.json({message: 'other user not found'})}

                        return res.json({otherUser: user})
                    })
            } else {
                return res.json({messages})
            }
        }
    })
}

exports.send_new_message_post = function (req, res, next) {
    // check if there is already a conversation between users
    console.log(req.params)
    console.log(req.body.newMessage)

    const users = req.params.id.split('-')
    const [ user1, user2] = users

    DirectMessage.findOne({
        $and: [
            { party: user1 },
            { party: user2 },
        ] 
    }).exec(async function(err, conversation) {
        if (err) { return next(err); }

        // if there is, append message in content (does mongo create an _id for the message? YES), and change updatedAt field
        if (conversation) {
            const update = { updatedAt:  new Date(), content: [...conversation.content, {
                userId:  req.body.userId,
                message: req.body.newMessage,
                createdAt:  new Date()
            }]}
            DirectMessage.findByIdAndUpdate(conversation._id, update, { new: true }).exec(function(err, updated) {
                if (err) { return next(err); }

                return res.json({ updated })
            })
        }

        // if there is no conversation, create a new conversation with DirectMessage save
        if (!conversation) {
            var message = new DirectMessage(
                { 
                    party: [user1, user2],
                    updatedAt: new Date(),
                    content: [
                        {
                            userId: req.body.userId,
                            message: req.body.newMessage,
                            createdAt: new Date()
                        }
                    ]
                });

            await message.save({ new: true }, function (err, updated) {
                if (err) { return next(err); }
                // Successful
                console.log('message created')
                return res.json({ updated })
            });

            
        }
        
    })

    

    
}