var express = require('express');
var router = express.Router();
const authMiddleware = require('../middlewares/auth');

// Require controller modules.
const userController = require('../controllers/userController');
const hootController = require('../controllers/hootController');
const messageController = require('../controllers/messageController');

// Login page.
router.post('/usercheck', userController.username);
router.post('/login', userController.password);

// Sign up page.
router.post('/signup', userController.user_create_post);

router.get('/test', userController.test_get);
router.post('/test', userController.test_post);
router.get('/usercheck', userController.test_list);

// Get user feed
router.get('/feed/:id', userController.user_feed_get)

// Find users
router.post('/user/search', userController.usernames_search)

// Change password
router.post('/change-password', userController.change_password_post);

// Follow user
router.post('/follow', userController.follow_profile_post)

// Unfollow user
router.post('/unfollow', userController.unfollow_profile_post)

// Like Hoot
router.post('/hoot/like', userController.hoot_like_post)

// Get all liked hoots
router.get('/:userId/likes/', userController.user_likes_get);

// Log out user
router.get('/logout', userController.user_logout_get)

// messages
// Get all messages with users
router.post('/messages/', messageController.messages_post);

// Get message with selected user
router.get('/messages/:id/', messageController.chat_with_user_get);

// Post new message
router.post('/messages/:id', messageController.send_new_message_post);


// User hoots
// router.get('/hoots/:id', hootController.all_hoots_user)

// Create Hoot
router.post('/compose/hoot', hootController.hoot_compose_post);


// router.use(authMiddleware);	// Sem autenticação, todas as rotas abaixo são bloqueadas

// Check token
// router.get('api/session', (req, res) => {    
//     console.log('Session access')           
//     console.log(req.headers.authorization)           
//     return res.json({ isSessionActive: true })
//   });


router.get('/session', authMiddleware, (req, res) => {          
  return res.json({ isSessionActive: true, authData: req.authData })
});

// User Page
router.get('/user/:user', userController.user_page)

  



module.exports = router;
