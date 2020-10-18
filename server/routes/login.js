const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const{OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');
const { verificaEstado } = require('../middlewares/auth');
const { resource } = require('./cliente');
const app = express();


app.post('/login',(req, res) =>{
   let body = req.body;

   Usuario.findOne({email: body.email}, (err, usuarioDB) =>{

       if(err){
           return res.status(500).json({
               ok:false,
               err
            });
        }
        
        if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                err: {
                    msg: 'Usuario no existe'
                }
            });
        }


        if(body.password !== usuarioDB.password){
            return res.status(400).json({
                ok:false,
                err: {
                    msg: 'Usuario o contraseña Incorrectos'
                }
            });
        }

       const {nombre, apellido, email, role} = usuarioDB;

       let token = jwt.sign({
           usuario: usuarioDB
       }, process.env.SEED, {expiresIn: process.env.TOKEN_LIFE})

        res.json({
            ok:true,
            token
        });



   })

})

// async function verify(token) {
//     const ticket = await client.verifyIdToken({
//         idToken: token,
//         audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
//         // Or, if multiple clients access the backend:
//         //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
//     });
//     const payload = ticket.getPayload();
 
//     return {
//         nombre: payload.name,
//         email: payload.email,
//         img: payload.picture,
//         google: true
//     }

//   }


module.exports = app;