import UserModel from '../models/user.model.js'

class UserRepository {
    async getUserByEmail(email) {
        return UserModel.findOne({ email })
    }
    async getUserById(userId) {
        try {
            const user = await UserModel.findById(userId)
            if (!user) {
                throw new Error("no existe un usuario con ese Id")
            }
            return user
        } catch (error) {
            console.log(error)
        }
    }

    async changeRole(userId, newRole) {
        const user = await UserModel.findById(userId)
        if (!user) {
            throw new Error("No existe un usuario con ese Id")
        }
        const docsNames = user.documents.map(
            element => element.name.split('.').slice(0, 1).shift())
        if (docsNames.includes('identificacion' && 'comprobante de domicilio' && 'comprobante de estado de cuenta')) {
            return await UserModel.findByIdAndUpdate(userId, { role: newRole }, { new: true })
        }
        else {
            throw new Error("faltan los siguientes documentos: 'identificacion', 'comprobante de cuenta' y 'comprobante de domicilio' ")
        }

    }

}
export default UserRepository
