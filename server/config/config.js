

/* Puerto */
process.env.PORT = process.env.PORT || 3000;

/* Vencimiento Del Token
 */
process.env.TOKEN_LIFE = '5d';

// Semilla para el token
process.env.SEED = process.env.SEED || 'esta-es-mi-super-clave-secreta';


/* Base de Datos */
// const urlDB = process.env.MONGO_URI;

const urlDB = 'mongodb+srv://user_back:BwnrNEcod2Qynotr@cluster0.sqpta.mongodb.net/bbva'

process.env.URLDB = urlDB;


//Google client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '558149484953-7keef0v46pr5mn3iq17s8t124u9d3dcn.apps.googleusercontent.com'
