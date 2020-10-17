//CRUD de la Aplicación


const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const {verificaToken, verificaRole} = require('../middlewares/auth');

const Clientes = require('../models/cliente');


// Obtener Usuarios
app.get('/clientes', (req, res) =>{

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);
    
    

   Clientes.find({}, 'firstname lastname')
           .limit(limite)
           .skip(desde)
           .exec( (err, clientes) => {
               if(err){
                   return res.status(400).json({
                       ok: false,
                       err
                   })
               }

               Clientes.countDocuments({}, (err, conteo) =>{

                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                   res.json({
                       ok: true,
                       clientes,
                       total: conteo
                   });
               });

           })
})


module.exports = app;