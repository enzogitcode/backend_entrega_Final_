import express from 'express'
const router= express.Router()
import ViewsController from '../controllers/view.controller.js'
const viewsController= new ViewsController()

router.get("/login", viewsController.renderLogin)
router.get("/register", viewsController.renderRegister)
router.get("/realtimeproducts", viewsController.renderRealTimeProducts)
router.get("/profile", viewsController.renderProfile)
router.get("/uploader", viewsController. renderUploader)

export default router