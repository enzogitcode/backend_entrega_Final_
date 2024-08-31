import UserModel from '../models/user.model.js'
import CartModel from '../models/cart.model.js'
import UserRepository from '../repositories/user.repository.js'
const userRepository = new UserRepository()
import CartRepository from '../repositories/cart.repository.js'
const cartRepository = new CartRepository()
import CartController from './cart.controller.js'
const cartController = new CartController()
import { createHash, isValidPassword } from '../utils/hashbcrypt.js'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'
const SECRET = config.SECRET
import EmailManager from '../services/email.js'
const emailManager = new EmailManager();
import { generateResetToken } from '../utils/randomCode.js'
import { isAdmin } from '../utils/isAdmin.js'
class UserController {
    async register(req, res) {
        let { first_name, last_name, email, age, password, documents, role, last_connection } = req.body
        try {
            const user = await userRepository.getUserByEmail(email)
            if (user) {
                console.log("Ya hay un usuario registrado con ese email")
                return res.status(400).send({ message: "El usuario ya existe" })
            }


            const newCart = new CartModel();
            const newUser = new UserModel({
                carts: newCart._id,
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                role: isAdmin(email, password, first_name),
                documents,
                last_connection
            })
            await newCart.save()
            await newUser.save()

            console.log("Nuevo usuario creado:", newUser)
            const token = jwt.sign(
                { user: newUser },
                config.SECRET,
                { expiresIn: "24h" }
            )
            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true,
                sameSite: 'none'
            }).json({ user: newUser })

        } catch (error) {
            console.log("Error al registrar el usuario", error)
            res.send(error)
        }
    }
    async login(req, res) {
        let { email, password } = req.body
        try {
            const user = await userRepository.getUserByEmail(email)
            if (!user) {
                console.log("usuario no encontrado")
            }
            const isValid = isValidPassword(password, user);
            if (!isValid) {
                return res.status(401).send("Contraseña incorrecta");
            }

            user.last_connection = new Date()
            await user.save()
            const token = jwt.sign({ user }, SECRET, { expiresIn: "24h" })
            res.cookie("coderCookieToken", token, {

                maxAge: 3600000,
                httpOnly: true
            }).json({user})
            //este redirect funciona
        } catch (error) {
            res.json(error)
            console.log(error)
        }
    }
    async profile(req, res) {
        try {
            console.log(req.user)
        } catch (error) {
            console.log(error)
            res.json({ error })
        }

    }

    async logout(req, res) {
        const token = req.cookies["coderCookieToken"]
        try {
            if (token) {
                const decoded = jwt.verify(token, SECRET)
                req.user = decoded
                const userId = decoded.user._id
                //actualizar last_connection
                const updatedUser = await UserModel.findByIdAndUpdate(userId)
                if (updatedUser) {
                    updatedUser.last_connection = new Date();
                    await updatedUser.save()
                }
                res.clearCookie("coderCookieToken").json({updatedUser})
            }
            else {
                res.send({ message: "No se encuentra el token" })
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor");
            return;
        }
        //esta parte si
    }

    async uploadFiles(req, res) {
        const { uid } = req.params
        try {
            const user = await UserModel.findByIdAndUpdate(uid)
            if (!user) {
                return res.status(400).send({ status: "error", error: "No existe un usuario con ese Id" })
            }

            if (!req.files) {
                return res.status(400).send({ status: "error", error: "No se pudo guardar la imagen" })
            }
            if (req.files.profile) {
                req.files.profile.map(element => {
                    const profileObjects = { name: element.filename, reference: element.path }
                    user.documents.push(profileObjects)
                })
            }
            if (req.files.documents) {
                req.files.documents.map(element => {
                    const documentsObjects = { name: element.filename, reference: element.path }
                    user.documents.push(documentsObjects)
                })
            }
            if (req.files.products) {
                req.files.products.map(element => {
                    const productsObjects = { name: element.filename, reference: element.path }
                    user.documents.push(productsObjects)
                })
            }
            const uniqueObject = {};
            for (const doc of user.documents) {
                const name = doc.name;
                uniqueObject[name] = doc;
            }
            const result = Object.values(uniqueObject);
            user.documents = result
            await user.save()
            res.json(user)

        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    async changeRole(req, res) {
        const { uid } = req.params
        try {
            const user = await UserModel.findById({ _id: uid })
            if (!user) {
                console.log("No existe un usuario con ese Id")
                res.send("No existe un usuario con ese Id")
            }
            const docsNames = user.documents.map(
                element => element.name.split('.').slice(0, 1).shift())
            if (docsNames.includes('identificacion' && 'comprobante de domicilio' && 'comprobante de estado de cuenta')) {
                const newRole = user.role === 'user' ? 'premium' : 'user'
                const updatedUser = await userRepository.changeRole(uid, newRole);
                console.log(updatedUser)
                res.json(updatedUser);
            }
            else {
                return res.status(400).json({ message: 'El usuario debe cargar los siguientes documentos: Identificación, Comprobante de domicilio, Comprobante de estado de cuenta' });
            }

        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }
    async getAllUsers(req, res) {
        try {
            const users = await UserModel.find()
            res.json(users)
        } catch (error) {
            res.status(500).send({ message: "No se pueden ver los usuarios" }, error)
        }
    }
    async deleteUser(req, res) {
        const userId = req.params.uid
        try {
            const user = await userRepository.getUserById(userId)
            if (!user) {
                res.json("no existe un usuario con ese id")
            }
            await CartModel.findByIdAndDelete(user.carts.toString())

            const deletedUser = await UserModel.findByIdAndDelete(userId)
            if (!user) {
                console.log({ message: "no existe un user con ese Id" })
            }

            res.json("usuario eliminado con éxito" + deletedUser + user.carts)

        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }
    async getUserById(req, res) {
        const { uid } = req.params
        try {
            const user = await userRepository.getUserById({ _id: uid })
            if (!user) {
                res.json("no existe un usuario con ese Id")
            }
            res.json(user)
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }
    async clearDocs(req, res) {
        const { uid } = req.params
        try {
            const user = await UserModel.findByIdAndUpdate({ _id: uid })
            if (!user) {
                res.json("no existe un usuario con ese Id")
            }
            user.documents = []
            await user.save()
            res.json(user)
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }
    async requestPasswordReset(req, res) {
        const { email } = req.body
        try {
            const user = await UserModel.findOne({ email })
            if (!user) {
                return res.status(404).send("Usuario no encontrado")

            }
            const token = generateResetToken();
            user.resetToken = {
                token: token,
                expire: new Date(Date.now() + 3600000)
            }
            await user.save()
            await emailManager.sendEmailResetPassword(email, user.first_name, token)
            console.log(user, token)
            res.json({ user, token })
        } catch (error) {
            res.status(500).send("Error interno del servidor")
        }
    }
    async resetPassword(req, res) {
        const { email, password, token } = req.body
        try {
            const user = await UserModel.find({ email })
            if (!user) {
                console.log("usuario no encontrado")
                res.json("usuario no encontrado")
            }
            const resetToken = user.resetToken
            if (!resetToken || resetToken.token !== token) {
                return res.json({ message: "El token es inválido" })
            }
            const nowDate = new Date()
            if (nowDate > resetToken.expire) {
                return res.json({ error: "el token es inválido" })
            }
            if (isValidPassword(password, user)) {
                res.json({ error: "La nueva contraseña no puede ser igual a la anterior" })

            }
            user.password = createHash(password)
            user.resetToken = undefined;
            await user.save()
            res.json({ user })
            return user
        } catch (error) {
            console.log(error)

        }
    }
}

export default UserController
