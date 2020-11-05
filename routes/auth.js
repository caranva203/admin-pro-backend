/*
    Ruta: /api/login
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT } = require('../middelwares/validar-jwt');
const { login, googleSingIn, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middelwares/validar-campos');


const router = Router();

router.post( '/',
    [
        check('email','El email es obligatorio').isEmail(),
        check('password','El password es obligatorio').not().isEmpty(),
        validarCampos
    ],
    login
);

router.post( '/google',
    [
        check('token','El token de google es obligatorio').not().isEmpty(),
        validarCampos
    ],
    googleSingIn
);

// renovar token
router.get( '/renew',
    validarJWT,
    renewToken
);



module.exports = router;