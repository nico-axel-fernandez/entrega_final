const fs = require('fs')
const Carrito = require('./carrito.js').Carrito
const Producto = require('./producto.js').Producto

let carrito = new Carrito('./carritos.json');
let producto = new Producto('./productos.json');

// crear productos de test si el array está vacío o no existe el json
producto.createTestProducts()

// test 1 eliminar un producto por id
const test1 = async (id) => {
    let prod = await producto.deleteById(id)
}
//test1(2)

// test 2 elegir un producto por id o todos si el id no existe
const test2 = async (id) => {
    let prod = await producto.getById(id)
    console.log(prod)
}
//test2(1)

// test 3 sumar productos al listado
let body = {"nombre":"Test","sku":"TEST1234","precio":999,"descripcion":"Producto de Test","stock":1,"foto":"https://"}
const test3 = async (newProd) => {
    let prod = await producto.saveProduct(newProd.nombre, newProd.sku, newProd.precio, newProd.descripcion, newProd.stock, newProd.foto);
    console.log(prod)
}
//test3(body)

// test 4 actualizar un producto entero
const test4 = async (id, newProd) => {
    let prod = await producto.updateProduct(id, newProd);
}
//test4(2,body)

// test 5 crear un carrito y devolver id
//carrito.createCart()

// test 6 elimina un carrito
//carrito.deleteCartById(2)

// test 7 listar todos los productos del carrito
//carrito.getAllProducts(3)

// test 8 agregar productos por id al carrito 
const test8 = async (idCart, idProd) => {
    let prod = await producto.getById(idProd);
    await carrito.addNewProductToCart(idCart, prod)
 }
//test8(3,1)

// test 8 bis sumar un producto existente 
const test8b = async (idCart, idProd) => {
    await carrito.sumProductToCart(idCart, idProd)
 }
// test8b(3,1)


// test 8 bisbis agregar un producto nuevo o sumar
const test8bb = async (idCart, idProd) => {
    let prod = await producto.getById(idProd);
    await carrito.addProductToCart(idCart, idProd, prod)
 }
test8bb(3,2)


// test 9 elimi<nar producto por ids 
const test9 = async (idCart, idProd) => {
    await carrito.deleteProductById(idCart, idProd)
 }
//test9(3,1)