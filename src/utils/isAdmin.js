import config from "../config/config.js"

export const isAdmin = ( email, password, first_name ) => {
    if (email == config.ADMIN_EMAIL && password == config.ADMIN_PASSWORD && first_name == config.ADMIN_NAME) {
        return 'admin'
    }
    else {
        return 'user'
    }
}
