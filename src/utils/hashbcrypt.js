import bcrypt from 'bcrypt'

//createHash

const createHash = password=> bcrypt.hashSync(password, bcrypt.genSaltSync(10))
//isValid Password

const isValidPassword= (password, user)=> bcrypt.compareSync(password, user.password)

export {createHash, isValidPassword}
