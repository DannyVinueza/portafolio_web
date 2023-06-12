//Ariba del todo
const Portfolio = require('../models/portafolio')

const renderAllPortafolios = async(req,res)=>{
    //A partir del modelo usar el metodo find
    const portfolios = await Portfolio.find().lean()
    res.render("portafolio/allPortfolios",{portfolios})
}

const renderPortafolio = (req,res)=>{
    res.send('Mostrar el detalle de un portafolio')
}

const renderPortafolioForm = (req,res)=>{
    res.render('portafolio/newFormPortafolio')
}

const createNewPortafolio =async (req,res)=>{
    //Desestructurar
    const {title, category,description} = req.body
    //Crear una nueva instancia
    const newPortfolio = new Portfolio({title,category,description})
    //Ejecutar el metodo save
    await newPortfolio.save()
    res.redirect('/portafolios')
}

const renderEditPortafolioForm =async(req,res)=>{
    //Apartir del modelo llamar al metodo findById
    const portfolio = await Portfolio.findById(req.params.id).lean()
    //Con la variable portafolio pintar en la vista del formulario
    res.render('portafolio/editPortfolio',{portfolio})
}

const updatePortafolio = async(req,res)=>{
    //Capturamos los datos del formulario
    const {title,category,description}= req.body
    //A partir del modelo llamar al metodo findByIdAndUpdate
    //Pasando a la funcion el id del porafolio y los datos a modificar
    await Portfolio.findByIdAndUpdate(req.params.id,{title,category,description})
    //Redirect
    res.redirect('/portafolios')
}

const deletePortafolio = async(req,res)=>{
    //Apartir del modelo usar el metodo findByIdAndDelete
    await Portfolio.findByIdAndDelete(req.params.id)
    //Hacer el redirect
    res.redirect('/portafolios')
}

//Exportacion nombrada
module.exports ={
    renderAllPortafolios,
    renderPortafolio,
    renderPortafolioForm,
    createNewPortafolio,
    renderEditPortafolioForm,
    updatePortafolio,
    deletePortafolio
}