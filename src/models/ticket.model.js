import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        require: true,
        unique: true
    },
    purchase_dateTime: {
        type: Date,
        default: Date.now,
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    purchaser: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "users"
    }
})

/* ticketSchema.pre('findOne', function (next) {
    this.populate('users.carts', '_id products');
    next();
}); */

const TicketModel = mongoose.model("tickets", ticketSchema)

export default TicketModel