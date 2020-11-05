const { Schema, model } = require('mongoose');

const MedicoSchema = Schema({

    nombre: {
        type: String,
        require: true
    },
    img: {
        type: String,
    },
    usuario: {
        type: Schema.Types.ObjectId, 
        ref: 'Usuario',
        require: true,
    },
    hospital: {
        type: Schema.Types.ObjectId, 
        ref: 'Hospital',
        require: true,
    }

});

//Modificar en el json de respuesta el _id que se trae desde la base de datos.
MedicoSchema.method('toJSON', function(){
  const { __v, ...object } = this.toObject();
  return object;
})

module.exports = model( 'Medico', MedicoSchema );