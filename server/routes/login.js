const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const{OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/cliente');
const usuario = require('../models/cliente');
const { verificaEstado } = require('../middlewares/auth');
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
                    msg: 'Usuario o Contraseña Incorrectos'
                }
            });
        }

        if(usuarioDB.estado === false){
            return res.status(400).json({
                ok:false,
                err: {
                    msg: 'Usuario no existe'
                }
            });
        }

        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok:false,
                err: {
                    msg: 'Usuario o contraseña Incorrectos'
                }
            });
        }

       const {nombre, google, email, role, img} = usuarioDB;

       let token = jwt.sign({
           usuario: usuarioDB
       }, process.env.SEED, {expiresIn: process.env.TOKEN_LIFE})

        res.json({
            ok:true,
            usuario: {
                nombre,
                email,
                google,
                role,
                img
            },
            token
        });



   })
})

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
 
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

  }



app.post('/google', async(req,res) =>{

    let token = req.body.idtoken;


    const googleUser = await verify(token)
    .catch(e =>{
        res.status(401).json({
            ok: false,
            e
        });
    });


    Usuario.findOne({email: googleUser.email}, (err, usuarioDB) =>{
        if(err){
            res.status(500).json({
                ok: false,
                err
            });
        }

        if(usuarioDB){
            if(usuarioDB.google === false){
                res.status(400).json({
                    ok: false,
                    err: {
                        msg: 'Debe de usar su autenticación tradicional'
                    }
                });
            }else{
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {expiresIn: process.env.TOKEN_LIFE});

                return res.json({
                    ok: true,
                    usuarioDB,
                    token
                });
            }
        }else{
            // Si el usuario no existe en nuestra base de datos

            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) =>{

                if(err){
                    res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {expiresIn: process.env.TOKEN_LIFE});

                return res.json({
                    ok: true,
                    usuarioDB,
                    token
                });
            });
            
        }

    })

});








module.exports = app;