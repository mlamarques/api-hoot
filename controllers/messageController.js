var DirectMessage = require('../models/direct_message');
const { body,validationResult } = require('express-validator');

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
    const users = req.params.id.split('-')
    const [ user1, user2] = users
    let currentChat = []
    // Check if there is any direct_message with users
    const searchChat = DirectMessage.findOne({
        $and: [
            { party: user1 },
            { party: user2 },
        ] 
    }).exec()

    if (searchChat) {
        currentChat = await searchChat
    }
}