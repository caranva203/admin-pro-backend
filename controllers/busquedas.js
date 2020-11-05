// getTodo
const { response } = require('express');
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const hospital = require('../models/hospital');


const getTodo = async (req, res = response ) => {

    const busqueda =  req.params.busqueda;

    //expresiones regulares
    const regex = new RegExp( busqueda, 'i' );

    
    //Proceso asíncrono y no se entrega hasta que esté todo (await).
    const [ usuarios, medicos, hospitales] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Medico.find({ nombre: regex}),
        hospital.find({ nombre: regex})
    ]);

    res.json({
        ok: true,
        usuarios,
        medicos,
        hospitales
    });
}

const getDocumentosColeccion = async (req, res = response ) => {

    const tabla =  req.params.tabla;
    const busqueda =  req.params.busqueda;
    //expresiones regulares
    const regex = new RegExp( busqueda, 'i' );

    let data = [];

    switch ( tabla ) {
        case 'medicos':
            data = await Medico.find({ nombre: regex})
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img');
        break;

        case 'hospitales':
            data = await hospital.find({ nombre: regex})
                                    .populate('usuario', 'nombre img');
        break;

        case 'usuarios':
            data = await Usuario.find({ nombre: regex });
        break;
    
        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser usuarios/medicos/hospitales'
            });
    }

    res.json({
        ok: true,
        resultados: data
    });

}




module.exports = {
    getTodo,
    getDocumentosColeccion
}