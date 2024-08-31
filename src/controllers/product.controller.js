import ProductRepository from "../repositories/product.repository.js";
const productRepository = new ProductRepository()

class ProductController {
    async getProducts(req, res) {
        try {
            const products = await productRepository.getProducts()
            res.json(products)

        } catch (error) {
            console.log(error)
        }
    }
    async getProductById(req, res) {
        let productId = req.params.pid
        try {
            const product = await productRepository.getProductById(productId);
            
            res.json(product)
        } catch (error) {
            console.log(error)
        }
    }
    async addProduct(req, res) {
        const newProduct = req.body
        try {
            const product = await productRepository.addProduct(newProduct)
            res.json(product)
        } catch (error) {
            res.json(error)
            console.log(error)
        }
    }

    async updateProductById(req, res) {
        try {
            let productId = req.params.pid
            let newDataProduct = req.body
            const updatedProduct = await productRepository.updateProduct(productId, newDataProduct)
            res.json(updatedProduct)
        } catch (error) {
            res.json(error)
            console.log(error)
        }

    }
    async deleteProductById(req, res) {
        let productId = req.params.pid
        try {
            const deletedProduct = await productRepository.deleteProductById(productId)
            res.json({"Producto eliminado": deletedProduct})
        } catch (error) {
            res.json(error)
        }

    }
}
export default ProductController