const express = require('express')
const path = require('path');
const { engine }  = require('express-handlebars')
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const fileUpload = require('express-fileupload')

//Inicializaciones
const app = express();

//Invocar el archivo passport
require('./config/passport')

//Configuraciones
app.set('port',process.env.port || 3000)
app.set('views',path.join(__dirname, 'views'))
app.engine('.hbs',engine({
    defaultLayout:'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname:'.hbs'
}))
app.set('view engine','.hbs')

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads'
}));    

// Middlewares
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'))
//Creamos la KEY para el servidor --> secret
app.use(session({ 
    secret: 'secret',
    resave:true,
    saveUninitialized:true
}));
//Inicializar passport
app.use(passport.initialize())
//Inicializar session
app.use(passport.session())

//Variables globales
app.use((req,res,next)=>{
    res.locals.user = req.user?.name || null
    next()
})

//Rutas
app.get("/",(req,res)=>{
    res.render("index")
})
app.use(require('./routers/portafolio.routes'))
app.use(require('./routers/user.routes'))

//Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')))

module.exports = app