import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    owner: {
        type: String,
        default: 'admin'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: { type: String },
    code: {
        type: String,
        unique: true,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    thumbnails: {
        type: Array,
        default: []
    }
})

//productSchema.plugin(mongoosePaginate)
const ProductModel = mongoose.model("products", productSchema)

export default ProductModel