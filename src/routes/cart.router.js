import express from 'express'
const router = express.Router()
import CartController from '../controllers/cart.controller.js'
const cartController = new CartController

//funcionan
router.post("/", cartController.newCart)
router.get("/:cid", cartController.getCartById)
router.post("/:cid/products/:pid", cartController.addProducts)
router.delete("/:cid/products/:pid", cartController.deleteProduct)
router.delete("/:cid", cartController.clearCart)
router.put("/:cid", cartController.updateCart)
router.put("/:cid/products/:pid", cartController.updateQuantity)

//ruta para ver todos los carts
router.get("/", cartController.getAllCarts)
//creada por mí para eliminar carritos
router.delete("/delete/:cid", cartController.deleteCart)

router.post("/:cid/purchase", cartController.purchase)

export default router