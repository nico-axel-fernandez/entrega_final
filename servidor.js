const { captureRejectionSymbol } = require('events')
const express = require('express')
const fs = require('fs')
const app = express()
const { Router } = express
const router = Router()

const productosPath = './productos.json'
const Producto = require('./producto.js').Producto
const Carrito = require('./carrito.js').Carrito
let carrito = new Carrito('./carritos.json');
let producto = new Producto(productosPath);

app.use('/', express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:false}));
app.use('/api', router)

const PORT = 8080
const server = app.listen(PORT, () =>{
    console.log(`// Servidor inicializado en localhost: ${server.address().port}`)
})
server.on("error", error => console.log (`// Error en el servidor: ${error}`))

// Crear productos de test
producto.createTestProducts()

// PRODUCTOS

// GET '/api/productos' -> devuelve todos los productos.
router.get('/productos/:id', (req,res) => {
        producto.getById(parseInt(req.params.id)).then(productos => {
        res.json(productos) 
        })
});   
   
router.get('/productos/', (req,res) => {
        producto.getAllProducts().then(productos => {
        res.json(productos)
    })
});   

// POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado.
router.post('/productos/', (req,res) => {
    const body = req.body
    producto.saveProduct(body.nombre,body.sku, body.precio, body.descripcion, body.stock,body.url).then(producto => {
        res.json(producto)
    })
});

// PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.
router.put('/productos/:id', (req,res) => {
    const body = req.body
    producto.updateProduct(parseInt(req.params.id), body).then(producto => {
    res.json(producto)
})
});

// DELETE '/api/productos/:id' -> elimina un producto según su id.
router.delete('/productos/:id', (req,res) => {
    producto.deleteById(parseInt(req.params.id)).then(producto => {
        res.json({"Status":"Producto eliminado"})
})
});

// CARRITO

// POST: '/' - Crea un carrito y devuelve su id.
router.post('/carrito/', (req,res) => {
    carrito.createCart().then(carrito => {
    res.json(carrito)
})
});

// DELETE: '/:id' - Vacía un carrito y lo elimina.
router.delete('/carrito/:id', (req,res) => {
    carrito.deleteCartById(parseInt(req.params.id)).then(carrito => {
        res.json({"Status":"Carrito eliminado"})
})
});

// GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito
router.get('/carrito/:idCart/productos', (req,res) => {
    carrito.getAllProducts(parseInt(req.params.idCart)).then(carrito => {
        res.json(carrito)
    })
});

//POST: '/:id/productos' - Para incorporar productos al carrito por su id de producto
router.post('/carrito/:idCart/productos/:idProd', (req,res) => {
    const add = async (idCart,idProd) => {
        let prod = await producto.getById(idProd);
        await carrito.addProductToCart(idCart, idProd, prod)
     }
    add(parseInt(req.params.idCart), parseInt(req.params.idProd)).then(carrito => {
        res.json(carrito)
    })
    });

// DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto

router.delete('/carrito/:idCart/productos/:idProd', (req,res) => {
    carrito.deleteProductById(parseInt(req.params.idCart), parseInt(req.params.idProd)).then(carrito => {
        res.json({"Status":"Producto eliminado del carrito"})
})
});