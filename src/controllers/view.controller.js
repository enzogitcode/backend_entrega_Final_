import jwt from 'jsonwebtoken'
import passport from 'passport'
import config from '../config/config.js'
const SECRET = config.SECRET
import {cookieExtractor} from '../config/passport.config.js'

class ViewsController {
    async renderLogin(req, res) {
        res.render("login");
    }

    async renderRegister(req, res) {
        res.render("register");
    }
    async renderRealTimeProducts(req, res) {
        res.render("realTimeProducts")
    }
    async renderProfile(req, res) {
        res.render("profile")
    }
    async renderUploader(req, res) {
        const token = req.cookies["coderCookieToken"]
        const decoded = jwt.verify(token, SECRET)
        req.user = decoded
        res.json(decoded)
        //res.render("uploader", {user:decoded})
    }
}

export default ViewsController