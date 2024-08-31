import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },

    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    carts: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'premium'],
        default: 'user'
    },
    documents: {
        type: [
            {
                name: String,
                reference: String
            }
        ]
    },
    last_connection: {
        type: Date,
        default: Date.now
    },
    resetToken: {
        type:String,
        expire: Date
    }

})

const UserModel = mongoose.model("users", userSchema)

export default UserModel