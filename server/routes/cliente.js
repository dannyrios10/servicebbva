//CRUD de la Aplicación


const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const {verificaToken, verificaRole} = require('../middlewares/auth');

const Clientes = require('../models/cliente');


// Obtener Clientes
app.get('/clientes', [verificaToken, verificaRole],(req, res) =>{

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);
    
    

   Clientes.find({})
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
                       usuario: req.usuario,
                       ok: true,
                       clientes,
                       total: conteo
                   });
               });

           })
})


// Obtener Clientes por ID

// Obtener Clientes
app.get('/clientes/:id', [verificaToken],(req, res) =>{

    let id = req.params.id;

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 1;
    limite = Number(limite);
    

    if(req.usuario.role === 'USER_ROLE'){
           Clientes.find({identifier: id}, 'firstname lastname telefono')
           .limit(limite)
           .skip(desde)
           .exec( (err, clientes) => {
               if(err){
                   return res.status(400).json({
                       ok: false,
                       err
                   })
               }

               if(clientes.length <= 0){
                   return res.status(400).json({
                       ok: false,
                       msg: 'No se han encontrado usuarios con ese ID'
                   })
               }

               // Mostrar Campos Vacíos
                let campos = 0;
                const regEx = new RegExp(' ', 'g');
                const eval = clientes[0].telefono.replace(regEx, '');
                
                if(eval == ''){
                    campos += 1;
                }

               Clientes.countDocuments({}, (err, conteo) =>{

                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                   res.json({
                       usuario: req.usuario,
                       ok: true,
                       cliente: clientes,
                       camposVacios: campos,
                       total: conteo,
                   });
               });

           })
    }
    if(req.usuario.role === 'ADMIN_ROLE'){
        Clientes.find({identifier: id})
           .limit(limite)
           .skip(desde)
           .exec( (err, clientes) => {

            if(clientes.length <= 0){
             return res.status(400).json({
                 ok: false,
                 msg: 'No se han encontrado usuarios con ese ID'
             })
         }

               if(err){
                   return res.status(400).json({
                       ok: false,
                       err
                   })
               }
              
            // Ocultar Información sensible
            
                clientes[0].password = clientes[0].password.substring(-1,3) + '***';

            // Mostrar Campos Vacíos
            let campos = 0;
            const regEx = new RegExp(' ', 'g');
            const eval = clientes[0].telefono.replace(regEx, '');
            
                if(eval == ''){
                    campos += 1;
                }
             

               Clientes.countDocuments({}, (err, conteo) =>{

                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                   res.json({
                       usuario: req.usuario,
                       ok: true,
                       cliente: clientes,
                       total: conteo,
                       camposVacios: campos
                   });
               });

           })
    }

})



module.exports = app;