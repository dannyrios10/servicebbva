const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// const roleAdmitido = {
//     values: ['USER_ROLE', 'ADMIN_ROLE'],
//     message: '{VALUE} no es un role válido'
// };

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({

    nombre: {
        type: String
    },
    apellido: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE'
    }
});

usuarioSchema.plugin(uniqueValidator, 
    {message: '{PATH} debe de ser único'}
    )

module.exports = mongoose.model('Usuario', usuarioSchema);