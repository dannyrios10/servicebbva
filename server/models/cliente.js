const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// const roleAdmitido = {
//     values: ['USER_ROLE', 'ADMIN_ROLE'],
//     message: '{VALUE} no es un role válido'
// };

let Schema = mongoose.Schema;

let clienteSchema = new Schema({

    email: {
        type: String
    },
    identifier: {
        type: String
    },
    password: {
        type: String
    },
    code: {
        type: String
    },
    role: {
        type: String,
        default: 'CLIENT_ROLE'
    },
    fisrtname: {
        type: String
    },
    lastname: {
        type: String
    },
    department: {
        type: String
    },
    location: {
        type: String
    },
    telefono: {
        type: String,
        default: '  '
    }
});

clienteSchema.plugin(uniqueValidator, 
    {message: '{PATH} debe de ser único'}
    )

module.exports = mongoose.model('Cliente', clienteSchema);