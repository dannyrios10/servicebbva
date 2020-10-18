//CRUD de la Aplicación


const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const {verificaToken, verificaRole} = require('../middlewares/auth');

const Usuarios = require('../models/usuario');


// Obtener Usuarios
app.get('/usuarios', (req, res) =>{

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);
    
    

   Usuarios.find({}, 'nombre apellido email role')
           .limit(limite)
           .skip(desde)
           .exec( (err, usuarios) => {
               if(err){
                   return res.status(400).json({
                       ok: false,
                       err
                   })
               }

               Usuarios.countDocuments({}, (err, conteo) =>{

                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                   res.json({
                       ok: true,
                       usuarios,
                       total: conteo
                   });
               });

           })
})


module.exports = app;