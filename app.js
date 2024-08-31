import express from 'express';
const app = express();

import config from './src/config/config.js';
const port = config.port
import './database.js'

import addLogger from './src/utils/logger.js';
app.use(addLogger)
app.get("/loggerTest", (req, res) => {
    req.logger.fatal("Mensaje FATAL")
    req.logger.error("Mensaje ERROR")
    req.logger.warning("Mensaje WARNING")
    req.logger.info("Mensaje INFO")
    req.logger.http("Mensaje HTTP")
    req.logger.debug("Mensaje Debug")

    res.send("Logs generados")
})

import cors from 'cors'
app.use(cors(

    {
        origin: `http://localhost:5173`,
        credentials: true
    }
))

import passport from 'passport';
import { initializePassport } from './src/config/passport.config.js';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'))
app.use(cookieParser())

//passport
app.use(passport.initialize())
initializePassport()

//routers
import productRouter from './src/routes/product.router.js'
import cartRouter from './src/routes/cart.router.js'
import userRouter from './src/routes/user.router.js'
import viewsRouter from './src/routes/views.router.js'

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/users', userRouter)
app.use('/', viewsRouter)

//handlebars
import exphbs from 'express-handlebars'
import cookieParser from 'cookie-parser';
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

//swagger
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación de Island E-commerce",
            description: "App de el E-commerce líder en venta de artículos electrónicos y soluciones informáticas"
        }
    },
    apis: ["./src/docs/**/*.yaml"]
}
const specs = swaggerJSDoc(swaggerOptions)
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))


//listen
app.listen(port, () => {
    console.log(`Escuchando el puerto ${port}`);
})