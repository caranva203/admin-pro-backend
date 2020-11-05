const path = require('path');
const fs = require('fs');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');

const { actualizarImagen }  = require('../helpers/actualizar-imagen');




const fileUpload = (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    console.log(tipo);

    //validar tipo
    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un médico, usuario y hospital (tipo)'
        });
    }

    //Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningun archivo'
        });
    }

    //Procesar la imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extencionArchivo = nombreCortado[nombreCortado.length - 1];

    //validar extensión
    const extencionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extencionesValidas.includes(extencionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'El archivo no es de una extención permitida'
        });
    }

    //Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extencionArchivo}`;

    //path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Mover la imagen
    file.mv( path , (err) => {
        if (err){
            console.log( err );
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }
            
        //Actualizar bd
        actualizarImagen( tipo, id, nombreArchivo );  

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });
    });
    
}

const retornaImagen = ( req, resp = response ) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join( __dirname, `../uploads/${ tipo }/${ foto }`);

    //imagen por defecto
    if ( fs.existsSync( pathImg )) {
        resp.sendFile( pathImg );
    } else {
        const pathImg = path.join( __dirname, `../uploads/no-img.jpg`);
        resp.sendFile( pathImg );
    }

}


module.exports = {
    fileUpload,
    retornaImagen
}