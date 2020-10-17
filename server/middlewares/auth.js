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

        req.usuario = decoded.usuario;
        next();
    });


};

const verificaRole = (req, res, next) =>{

    if(req.usuario.role === 'USER_ROLE'){
        return res.status(401).json({
            ok: false,
            msg: 'Solo Administradores'
        });
    }

    next();



};

const verificaEstado = (req, res, next) =>{

    if(req.usuario.estado === false){
        return res.status(401).json({
            ok: false,
            msg: 'Accion no permitida'
        });
    }

    next();
};

const verificaTokenImg = (req, res, next) =>{

    let token = req.query.token; 

    jwt.verify(token, process.env.SEED, (err, decoded) =>{
        if(err){
            return res.status(401).json({
                ok:false,
                msg: 'Token no válido'
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};


module.exports = {
    verificaRole,
    verificaToken,
    verificaEstado,
    verificaTokenImg
};