const jwt = require('jsonwebtoken');

// Verificar Token

const verificaToken = (req, res, next) =>{

    let token = req.get('token'); 


    jwt.verify(token, process.env.SEED, (err, decoded) =>{
        if(err){
            return res.status(401).json({
                ok:false,
                msg: 'Token no válido'
            });
        }
        const {email, role} = decoded.usuario
        const final = {
            email,
            role
        } 
        req.usuario= final;
        next();
    });


};

// Verificar el Role

const verificaRole = (req, res, next) =>{

    if(req.usuario.role === 'USER_ROLE' || req.usuario.role === 'COMPANY_ROLE'){
        return res.status(401).json({
            ok: false,
            usuario: req.usuario,
            msg: 'Solo Administradores'
        });
    }

    next();

};


module.exports = {
    verificaRole,
    verificaToken
};