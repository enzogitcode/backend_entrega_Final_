import ProductModel from "../models/product.model.js"
import { generateMixedCode} from '../utils/randomCode.js'

class ProductRepository {
    async getProducts() {
        try {
            const products = await ProductModel.find().lean()
            
            return products


        } catch (error) {
            console.log(error)
        }
    }
    async getProductById(id) {

        try {
            const product = await ProductModel.findById(id).lean()
            if (!product) {
                console.log("producto no encontrado")
                return null
            }
            return product
        } catch (error) {
            console.log(("no existe un producto con ese Id"), error)
        }
    }
    async addProduct({ title, description, price, img, code, stock, category, thumbnails, owner }) {
        try {
            if (!title || !description || !price || !stock || !category) {
                console.log("Todos los campos son obligatorios");
                return;
            }

            const productExist = await ProductModel.findOne({ code: code });

            if (productExist) {
                console.log("El código debe ser único");
                return;
            }

            const newProduct = new ProductModel({
                owner,
                title,
                description,
                price,
                stock,
                category,
                img,
                code: generateMixedCode(),
                status: true,
                thumbnails: thumbnails || []
            });
            await newProduct.save();

            console.log(newProduct)
            return newProduct;

        } catch (error) {
            console.log(error)
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const product = await ProductModel.findByIdAndUpdate(id, updatedProduct);
            if (!product) {
                console.log("producto no encontrado")
                return null
            }

            console.log("producto actualizado")
            return product
        } catch (error) {
            console.log(error)
        }
    }
    async deleteProductById(id) {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(id)
            if (!deletedProduct) {
                console.log("No se encontró un producto con ese Id")
            }
            console.log("Producto eliminado correctamente de la base de datos: ", deletedProduct)
            return deletedProduct
        } catch (error) {
            console.log(error)
        }

    }

}


export default ProductRepository
