const express = require('express');
const {dbConnection} = require('./database/config');
const path = require('path');

const app = express();
require('./config/config');

const bodyParser = require('body-parser');
const dbConecction = require('./database/config');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//Habilitar la carpeta public

app.use(express.static(path.resolve(__dirname, '../public')));


dbConecction();

// Confiiguracion Global De Las Rutas
app.use(require('./routes/index'));


app.listen(process.env.PORT, () =>{
    console.log(`Escuchando desde el puerto ${process.env.PORT}`);
})
