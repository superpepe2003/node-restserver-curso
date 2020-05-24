const express = require('express');

let { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');


// =========================================
// LISTAR PRODUCTOS
// =========================================
app.get('/productos', verificaToken, (req, res) => {
    //trae todos los productos
    //populate: usuario categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true } )
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec( (err, productoDB) => {

            if( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
    
            if( !productoDB ){
                return res.status(400).json({
                    ok: false,
                    message: 'No hay Productos'
                });
            }
    
            res.json({
                ok: true,
                productos: productoDB
            });

        });


});

// =========================================
// LISTAR 1 PRODUCTO POR ID
// =========================================
app.get('/productos/:id', verificaToken, (req, res) => {
    //populate: usuario categoria
    //paginado

    let id = req.params.id;

    Producto.findById( id )
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec( (err, productoDB) => {

            if( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if( !productoDB ){
                return res.status(400).json({
                    ok: false,
                    message: 'No hay Productos'
                });
            }

            res.json({
                ok: true,
                productos: productoDB
            });

        });


});

// =========================================
// BUSCAR PRODUCTO
// =========================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            return res.json({
                ok: true,
                producto: productoDB
            })

        });

});


// =========================================
// CREAR 1 PRODUCTO
// =========================================
app.post('/productos', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado

    let body = req.body;

    let producto = new Producto({
        nombre:  body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        disponible: body.disponible,
        usuario: req.usuario._id
    });

    producto.save( (err, productoDB) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !productoDB ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    })


});

// =========================================
// ACTUALIZAR 1 PRODUCTO POR ID
// =========================================
app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate( id, body,{ new: true, runValidators: true }, ( err, productoDB) =>{ 

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !productoDB ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

// =========================================
// ELIMINAR 1 PRODUCTO POR ID
// =========================================
app.delete('/productos/:id', verificaToken, (req, res) => {
    // CAMBIAR EL DISPONIBLE A FALSE

    let id = req.params.id;

    Producto.findByIdAndUpdate( id, { disponible: false })
        .exec( (err, productoDB) => {

            if( err ){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    message: 'El producto que quiere borrar no existe'
                })
            }

            return res.json({
                ok: true,
                producto: productoDB
            })
        
        });

});


module.exports = app;