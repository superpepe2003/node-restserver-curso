const express = require('express');

let { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// ========================================
// MOSTRAR TODAS LAS CATEGORIAS
// ========================================

app.get('/categoria', verificaToken, (req,res) => {

    Categoria.find( { } )
                .sort('descripcion')
                .populate('usuario', 'nombre email')
                .exec( ( err, categoriaDB) => {

                    if( err ) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    if( !categoriaDB ){
                        return res.status(400).json({
                            ok: false,
                            message: 'No hay registro para mostrar'
                        });
                    }

                    res.json({
                        ok: true,
                        categorias: categoriaDB
                    });

                });

});

// ========================================
// MOSTRAR 1 CATEGORIA POR ID
// ========================================

app.get('/categoria/:id', verificaToken, (req,res) => {

    let id = req.params.id;

    Categoria.findById( id, ( err, categoriaDB) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !categoriaDB ){
            return res.status(400).json({
                ok: false,
                message: 'Id de Categoria no existe'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// ========================================
// CREAR NUEVA CATEGORIA
// ========================================

app.post('/categoria', verificaToken, (req,res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save( (err, categoriaDB ) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !categoriaDB ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })


    
});

// ========================================
// ACTUALIZAR 1 CATEGORIA
// ========================================

app.put('/categoria/:id', verificaToken, (req,res) => {

    var id = req.params.id;
    var body = req.body;

    let desc = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate( id, desc,{ new: true, runValidators: true }, ( err, categoriaDB) =>{

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !categoriaDB ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });

});

// ========================================
// ELIMINAR 1 CATEGORIA
// ========================================

app.delete('/categoria/:id', [verificaToken, verificaAdminRol], (req,res) => {

    //solo 1 admin puede borrar las categorias

    var id = req.params.id;

    Categoria.findByIdAndRemove( id, ( err, categoriaDB) =>{

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !categoriaDB ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        });


    });

});




module.exports = app;