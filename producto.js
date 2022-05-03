const fs = require('fs');

class Producto {
    
    constructor (fileName) {
        this.fileName = fileName;
        this.data = [];
    };

    // Para incorporar productos al listado (disponible para administradores)
    async saveProduct(nombre,sku, precio, descripcion, stock,url) {
        let producto = {nombre: nombre, sku: sku, precio: precio, descripcion: descripcion, stock:stock, timestamp: new Date(), foto: url, id: null}
        let id
        await this.loadData()
        if(this.data.length == 0){ 
            id = producto.id = 1;
        } else {
            id = producto.id = this.data[this.data.length - 1].id + 1
        }
        this.data.push(producto)
        await this.saveData()
        return id;
    };

    // Me permite listar todos los productos disponibles ó un producto por su id 
    async getById(productId){
        await this.loadData()
        let producto = this.data.find(producto => producto.id === productId)
        if(producto){
            return producto
        } else {
            this.getAllProducts()
            return this.data
        }
    };

    async getAllProducts(){
        let data = await this.loadData()
        return this.data 
    };

    // Actualiza un producto por su id
    async updateProduct(productId, body){
        await this.loadData()
        let producto = this.data.find(producto => producto.id === productId)
        Object.assign(producto, body)
        await this.saveData()
    }

    // Borra un producto por su id
    async deleteById(id){
        /**  @type {Array} */
        let index
        await this.loadData()
        index = this.data.findIndex(producto => producto.id === id)
        if(index < 0)
            {console.log('// Producto inexistente')}
        else {
            this.data.splice(index, 1)
            await this.saveData()
            console.log('// Producto eliminado')
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
    
    async createTestProducts(){
        await this.loadData()
        if(this.data.length == 0){
            await this.saveProduct('TV Samsung','UE55F8000AFXZ',40999.99, 'TV 80" LED HDMI SARASA', 1,'https://images.samsung.com/is/image/samsung/p6pim/latin/qn85qn85aapxpa/gallery/latin-neo-qled-qn85a-qn85qn85aapxpa-thumb-401093973?$160_160_PNG$');
            await this.saveProduct('Heladera Samsung','DE55F12312YAB', 180999.99, 'Heladera side by side de 22 lts', 1,'https://images.samsung.com/is/image/samsung/p6pim/latin/rs23a500asr-aa/gallery/latin-rs5300trs5300tc-410655-rs23a500asr-aa-thumb-530831777?$160_160_PNG$');
            console.log('// Archivo productos.json creado con productos de test')
        } else {
            console.log('// Archivo productos.json detectado con productos')
        }

    }

}

module.exports = {Producto}