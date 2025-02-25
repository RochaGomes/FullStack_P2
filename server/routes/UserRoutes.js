const express = require('express');
const { registerUser , loginUser , searchItems } = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerUser );
router.post('/login', loginUser );
router.get('/search', auth, searchItems); // Rota protegida para busca
router.post('/insert', auth, insertItem); // Rota protegida para inserção

module.exports = router;