const User = require('../models/User')
const passport = require("passport")

//Presentar el formulario para el registro
const renderRegisterForm =(req,res)=>{
    res.render('user/registerForm')
}

//Capturar los datos del formulario y guardar en BDD
const registerNewUser =async(req,res)=>{
    //Desestructurar los datos del formulario
    const{name, email, password,confirmpassword} = req.body
    //Validar si todos los campos estan completos
    if(Object.values(req.body).includes("")) return res.send("Lo sentimos, debes llenar todos los campos")

    //Validacion de las contraseñas
    if(password != confirmpassword) return res.send("Lo sentimos, los passwords no coinciden")

    //Traer al usuario en base al email
    const userBDD = await User.findOne({email})

    //Verificar si existe el usuario
    if(userBDD ) return res.send("Lo sentimos, el email ya se encuentra registrado")

    //Guarda el registro en la BDD
    const newUser = await new User({name, email, password, confirmpassword})

    //Encriptar el usuario
    newUser.password = await newUser.encrypPassword(password)
    newUser.save()
    res.redirect('/user/login')
}


//resentar el formulario para el registro
const renderLoginForm =(req,res)=>{
    res.render('user/loginForm')
}

//Capturar los datos del formulario y guardar en BDD
const loginUser = passport.authenticate('local',{
    failureRedirect:'/user/login',
    successRedirect:'/portafolios'
})

const logoutUser =(req,res)=>{
    req.logout((err)=>{
        if (err) return res.send("Ocurrio un error") 
        res.redirect('/');
    });
}

module.exports={
    renderRegisterForm,
    registerNewUser,
    renderLoginForm,
    loginUser,
    logoutUser
}