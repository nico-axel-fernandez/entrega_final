const fs = require('fs');

class Carrito {
    
    constructor (fileName) {
        this.fileName = fileName;
        this.data = [];
    };
     
    // Crea un carrito y devuelve su id.
    async createCart() {
        let carrito = {timestamp: new Date(), id: null, productos: []}
        let id
        await this.loadData();
        if(this.data.length == 0){ 
            id = carrito.id = 1;
        } else {
            id = carrito.id = this.data[this.data.length - 1].id + 1
        }
        this.data.push(carrito)
        await this.saveData()
        return id
    };

    // Para incorporar productos al carrito por su id de producto
    async isProductInCart(cartId, productId){
        let productos = await this.getAllProducts(cartId)
        if(productos){
        let index = productos.findIndex(producto => producto.id === productId)
        if(index < 0){
            return false
        } else {
            return true
        }} else {
            console.log('// Carrito inexistente')
            return 'Not'}
    };

    async addNewProductToCart(cartId, producto) {
        let carrito = await this.getCartById(cartId)
        if(carrito){
        carrito.productos.push(producto);
        await this.saveData()}
        else {console.log('// Carrito inexistente')}
    };

    async sumProductToCart(cartId, productId){
        let productos = await this.getAllProducts(cartId)
        let index = productos.findIndex(producto => producto.id === productId)
        productos[index].stock++
        await this.saveData()
    }

    async addProductToCart(cartId, productId, producto){
        let isProduct = await this.isProductInCart(cartId, productId)
        if(isProduct != 'Not'){ 
        if(isProduct){
            await this.sumProductToCart(cartId, productId)
            console.log('// Producto sumado')
        } else {
            await this.addNewProductToCart(cartId, producto)
            console.log('// Producto nuevo añadido')
        }
        } else {
            console.log('// Carrito inexistente')
    }
        
    }

    async getCartById(cartId){
        await this.loadData()
        let carrito = this.data.find(carrito => carrito.id === cartId)
        if(carrito){
            return carrito
        } else {
            console.log("// Carrito inexistente")
            return false
        }
    };

    // Me permite listar todos los carritos
    async getAllCarts(){
        await this.loadData()
        return this.data
    };

    // Me permite listar todos los productos guardados en el carrito
    async getAllProducts(cartId){
        await this.loadData()
        let carrito = this.data.find(carrito => carrito.id === cartId)
        if(carrito){ 
            return carrito.productos
        } else { 
            console.log('// Carrito inexistente')
            return false
        }
    };

    // Vacía un carrito y lo elimina.
    async deleteCartById(cartId){
        await this.loadData()
        let index = this.data.findIndex(carrito => carrito.id === cartId)
        if(index < 0) {
            console.log('// Carrito '+cartId+' inexistente')
        }
        else {
            this.data.splice(index, 1)
            await this.saveData()
            console.log('// Carrito '+cartId+' eliminado')
        }
    };

    // Eliminar un producto del carrito por su id de carrito y de producto
    async deleteProductById(cartId, productId){
        let productos = await this.getAllProducts(cartId)
        let index = productos.findIndex(producto => producto.id === productId)
        if(index < 0) {
            console.log('// Producto '+productId+' inexistente')
        }
        else {
            productos.splice(index, 1)
            await this.saveData()
            console.log('// Producto '+productId+' eliminado')
        }
    };

    async loadData(){
        let data
        try{
            data = fs.readFileSync(this.fileName, 'utf-8')
            data = JSON.parse(data);
        }
        catch (err) {
            data = []
        }
        this.data = data
    }

    async saveData(){
        try{
            await fs.promises.writeFile(this.fileName, JSON.stringify(this.data));
        }
        catch(err){
            console.log(err)
        }
    }
}

module.exports = {Carrito}