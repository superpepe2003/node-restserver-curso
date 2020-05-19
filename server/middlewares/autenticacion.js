const jwt = require('jsonwebtoken');

// ==========================
// Verificar Token
// ==========================

let verificaToken = ( req, res, next ) => {

    let token = req.get('token');

    jwt.verify( token, process.env.SEED, (err, decode) => {

        if( err ) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decode.usuario;

        next();

    });

};

// ==========================
// Verificar adminRol
// ==========================

let verificaAdminRol = (req, res, next) => {

    let adminRol = req.usuario.role;

    if ( adminRol !== 'ADMIN_ROLE' ) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'No tiene permiso para la operación'
                }
            });
    }

    next();

}


module.exports = {
    verificaToken,
    verificaAdminRol
}