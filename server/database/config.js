const mongoose = require('mongoose');
require('colors');

const dbConecction = async () =>{



    try {
        await mongoose.connect(process.env.URLDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('DB ONLINE'.green);

    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la Base de Datos');
    }



}

module.exports = dbConecction;