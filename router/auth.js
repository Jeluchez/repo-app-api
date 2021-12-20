/*
    path: api/login
*/
const { Router } = require('express');
const { check } = require('express-validator');

// Controladores
const { createUser, login, renewToken, read,confirmEmail,recieveOauth,loginGithub} = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


// read users
router.get('/',read)
// Crear nuevos usuarios
router.post( '/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos
], createUser );

// confirm account
router.get('/confirm-email/:id', confirmEmail);

// Login
router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], login);

// Revalidar Token
router.get('/renew', validarJWT, renewToken);

router.get('/callback', recieveOauth)

module.exports = router;