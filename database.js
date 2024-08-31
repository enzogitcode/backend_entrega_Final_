import mongoose from 'mongoose'
import configObject from './src/config/config.js'

const { mongo_Url } = configObject

mongoose.connect(mongo_Url)
    .then(() => console.log("conectados a la db"))
    .catch((error) => console.log(error))
