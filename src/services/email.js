import nodemailer from 'nodemailer'

class EmailManager {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                user: "etodocode@gmail.com",
                pass: ""
            }
        })

    }
    async sendEmailPurchase(email, first_name, ticket) {
        try {
            const mailOptions = {
                from: 'Islanders Ecommerce etodocode@gmail.com',
                to: email,
                subject: "Confirmación de compra",
                html: `
                <h1>Confirmación de Compra</h1>
                <p>Gracias por tu compra ${first_name}</p>
                <p>El número de tu orden es: ${ticket}</p>`

            }
            await this.transporter.sendMail(mailOptions)
        } catch (error) {
            console.log(error)
        }
    }
    async sendEmailResetPassword(email, first_name, token) {
        try {
            const mailOptions = {
                from: 'Islanders Ecommerce etodocode@gmail.com',
                to: email,
                subject: "Restablecimiento de contraseña",
                html: `
                <h1>Restablecimiento de contraseña</h1>
                <p>Hola ${first_name}</p>
                <p>Pediste restablecer la contraseña. Te enviamos el código de confirmación: <strong>${token}</strong></p>
                <p>Este código expira en una hora</p>
                <a href="http://localhost:8080/password">Restablecer contraseña </a>
                `

            }
            await this.transporter.sendMail(mailOptions)

        } catch (error) {
            console.log(error)
        }
    }
}


export default EmailManager