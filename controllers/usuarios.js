const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');



const getUsuarios = async (req, res) => {

    const desde = Number( req.query.desde ) || 0 ;

    // Se espera a que se resuelvan todas las promesas.
    const [ usuarios, total ] = await Promise.all([
        // Primera promesa 
        Usuario
            .find({}, 'nombre email role google img')
            .skip(desde)
            .limit(5),
        // segunda promesa 
        Usuario.countDocuments()
    ]);

    res.json({
        ok: true,
        usuarios,
        total
    });
}

//Metodo para crear un usuario 
//Nota. se usa async para que funcione en await 
const crearUsuario = async (req, res = response) => {

    // se relaciona las propiedades de del objeto del req  
    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        //Validación de existencia del correo 
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }
        // Se crea una nueva instancia del objeto con los valores
        const usuario = new Usuario(req.body);

        //Encryptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        // proceso asincrono para guardar la información a la bd
        // nota: se coloca await para que no siga el proceso hasta que termine.
        // solo con promesas. 
        await usuario.save();

        //Generar el TOKEN - JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }


}

const actualizarUsuario = async( req, res = response ) => {
    // TODO: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;

    try{

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        // Actualizaciones 
        //extraer los parametros de password, google y email del objeto json
        const { password, google, email, ...campos} = req.body;

        if ( usuarioDB.email !== email ) {

            const existeEmail = await Usuario.findOne({ email });
            if ( existeEmail ) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Yá existe un usuario con ese email'
                });
            }
        }

        if( !usuarioDB.google ){
            // Se vuelve añadir el email al json 
            campos.email = email;
        } else if ( usuarioDB.email !== email ){
            return res.status(404).json({
                ok: false,
                msg: 'Usuario de google no pueden cambiar su correo'
            });
        }
        
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            usuarioActualizado
        });

    } catch ( error ){
        console.log( error );
        res.status(500).json({
            ok: false,
            msg: 'Error inseperado'
        });
    }

}

const borrarUsuario = async (req, res = response) => {

    const uid = req.params.id;

    try{

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        await Usuario.findByIdAndDelete( uid );

        res.json({
            ok: true,
            uid: 'Usuario eliminado'
        });

    } catch ( error ) {
        console.log( error );
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}