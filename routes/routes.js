var express = require('express');
var router = express.Router();
const authMiddleware = require('../middlewares/auth');

// Require controller modules.
const userController = require('../controllers/userController');

// Login page.
router.post('/usercheck', userController.username);
router.post('/login', userController.password);

// Sign up page.
router.post('/signup', userController.user_create_post);

router.get('/test', userController.test_get);
router.post('/test', userController.test_post);
router.get('/usercheck', userController.test_list);

router.use(authMiddleware);	// Sem autenticação, todas as rotas abaixo são bloqueadas

// Check token
router.get('/session', (req, res) => {               
    return     
  });



module.exports = router;
