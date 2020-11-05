/**
 * Ruta: /api/hospitales
 */

const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middelwares/validar-campos');
const { validarJWT } = require('../middelwares/validar-jwt');

const {
    getHospitales,
    crearHospital,
    ActualizarHospital,
    BorrarHospital
} = require('../controllers/hospitales');

const router = Router();

router.get( '/', validarJWT, getHospitales );

//validaciones de los atributos del json de respuesta
router.post( '/',
    [
        validarJWT,
        check('nombre','El nombre del hospital es necesario').not().isEmpty(),
        validarCampos
    ],
    crearHospital 
);

router.put( '/:id',
    [
        validarJWT,
        check('nombre','El nombre del hospital es necesario').not().isEmpty(),
        validarCampos
    ],
    ActualizarHospital 
);

router.delete( '/:id',
    validarJWT,
    BorrarHospital 
);







module.exports = router;