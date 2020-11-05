/**
 * Ruta: /api/medicos
 */

const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middelwares/validar-campos');
const { validarJWT } = require('../middelwares/validar-jwt');

const {
    getMedicos,
    crearMedico,
    ActualizarMedico,
    BorrarMedico
} = require('../controllers/medicos');

const router = Router();

router.get( '/', validarJWT, getMedicos );

//validaciones de los atributos del json de respuesta
router.post( '/',
    [
        validarJWT,
        check('nombre','El nombre del médico es necesario').not().isEmpty(),
        check('hospital','El hospital id debe ser válido').isMongoId(),
        validarCampos
        
    ],
    crearMedico 
);

router.put( '/:id',
    [
        validarJWT,
        check('nombre','El nombre del médico es necesario').not().isEmpty(),
        check('hospital','El hospital id debe ser válido').isMongoId(),
        validarCampos    
    ],
    ActualizarMedico 
);

router.delete( '/:id',

    BorrarMedico 
);







module.exports = router;