import express from 'express'
const router = express.Router()
import UserController from '../controllers/user.controller.js'
const userController = new UserController()
import passport from 'passport'
import {uploader} from '../middleware/multer.js'

//creadas por mí para ver usuarios y eliminarlos
router.get("/", userController.getAllUsers)
router.get("/:uid", userController.getUserById)
router.delete("/delete/:uid", userController.deleteUser)


router.post("/login", userController.login)
router.post("/register", userController.register)
router.post("/logout", userController.logout.bind(userController))
router.get("/profile", passport.authenticate("jwt", {session:false}), userController.profile)
router.post("/:uid/documents", uploader.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'products', maxCount: 10 },
    { name: 'documents', maxCount: 3 }
]),
userController.uploadFiles)
router.put("/premium/:uid", userController.changeRole)
router.put("/cleardocs/:uid", userController.clearDocs)
router.delete("/:uid", userController.deleteUser)

export default router