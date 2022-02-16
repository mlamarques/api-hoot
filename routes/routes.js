var express = require('express');
var router = express.Router();
const authMiddleware = require('../middlewares/auth');

// Require controller modules.
const userController = require('../controllers/userController');
const hootController = require('../controllers/hootController');

// Login page.
router.post('/usercheck', userController.username);
router.post('/login', userController.password);

// Sign up page.
router.post('/signup', userController.user_create_post);

router.get('/test', userController.test_get);
router.post('/test', userController.test_post);
router.get('/usercheck', userController.test_list);

// Find users
router.post('/user/search', userController.usernames_search)

// User Page
router.get('/:user', userController.user_page)

// User hoots
// router.get('/hoots/:id', hootController.all_hoots_user)

// Hoot
router.post('/compose/hoot', hootController.hoot_compose_post);

router.use(authMiddleware);	// Sem autenticação, todas as rotas abaixo são bloqueadas

// Check token
router.get('api/session', (req, res) => {               
    return     
  });

  



module.exports = router;
