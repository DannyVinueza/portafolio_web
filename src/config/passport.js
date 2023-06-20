//Importacion de passport
const passport = require("passport")

//Importacion del modelo user
const User = require('../models/User')

//Definicion de la estrategia
const LocalStrategy = require("passport-local").Strategy

//Configuracion de la estrategia
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    //Taraer al usuario en base al email
    const userBDD = await User.findOne({ email })

    //Validacion del usuario
    if (!userBDD) return done("Lo sentimos, el email no se enuentra registrado", false)

    //Validacion de las contraseñas
    const passwordUser = await userBDD.matchPassword(password)

    //Validacion del password del formulario vs la BDD
    if (!passwordUser) return done("Lo sentimos, los passwords no coinciden", false)
    
    //Validacion de la confirmacion de la cuenta
    if(userBDD.confirmEmail===false) return done("Lo sentimos, debe verificar la cuenta en su correo electrónico",false)
    //Retornar el usuario
    return done(null, userBDD)
}))

//Serializar al usuario
passport.serializeUser((user,done)=>{
    done(null,user.id)
})

//Deserializacion del usuario
passport.deserializeUser(async (id, done) => {
    const userDB = await User.findById(id).exec();
    return done(null, userDB)
});