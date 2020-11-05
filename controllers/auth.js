const { response } = require("express");
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require("../helpers/google-verify");



const login = async( req, res = response) => {

    const { email, password } = req.body;

    try{

        //verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'email o contraseña no son válidas'
            });
        }

        //Verificar constraseña
        const validarPassword = bcrypt.compareSync( password, usuarioDB.password );

        if (!validarPassword ) {
            return res.status(404).json({
                ok: false,
                msg: 'email o contraseña no son válidas'
            });
        }

        //Generar el TOKEN - JWT
        const token = await generarJWT( usuarioDB.id );

        res.json({
            ok: true,
            token: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            token: 'Hable con el administrador'
        });
    }
}

const googleSingIn = async ( req, res = response ) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify( googleToken );

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if ( !usuarioDB ) {
            // si no existe
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true

            });
        } else {
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        //Guardar en DB
        await usuario.save();

        //Generar el TOKEN - JWT
        const token = await generarJWT( usuario.id );


        res.json({
            ok: true,
            token
        });
    
        
    } catch (error) {

        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto'
        });
        
    }
    
}

const renewToken = async ( req, res = response ) => {

    const uid = req.uid;

    //Generar el TOKEN - JWT
    const token = await generarJWT( uid );

    res.json({
        ok: true,
        token
    });
}

module.exports = {
    login,
    googleSingIn,
    renewToken
}