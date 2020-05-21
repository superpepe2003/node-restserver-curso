

// ===============================
// PUERTO 
// ===============================

process.env.PORT = process.env.PORT || 3000;

// ===============================
// ENTORNO
// ===============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===============================
// Base de datos 
// ===============================

let urlDB;

if( process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ===============================
// Vencimiento del Token 
// ===============================
// 60 SEGUNDOS
// 60 MINUTOS
// 24 HORAS
// 30 DIAS

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ===============================
// Seed de autenticación
// ===============================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ===============================
// Google Client Idd
// ===============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '483567341192-udqahmiphpuj71p3vmiehuv5a7n307f8.apps.googleusercontent.com';