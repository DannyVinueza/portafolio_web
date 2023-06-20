//Ariba del todo
const Portfolio = require('../models/portafolio')
const { uploadImage,deleteImage } = require('../config/cloudinary')
const fs = require('fs-extra')


const renderAllPortafolios = async(req,res)=>{
    //A partir del modelo usar el metodo find
    const portfolios = await Portfolio.find({user:req.user._id}).lean()
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
    //
    newPortfolio.user = req.user._id
    //Verifica si el formulario tiene una imagen para subirla 
    //y si no tiene manda un mensaje de advertencia
    if(!(req.files?.image)) return res.send("Se requiere una imagen")
    //La invocacion de  
    const imageUpload = await uploadImage(req.files.image.tempFilePath)
    newPortfolio.image = {
        public_id:imageUpload.public_id,
        secure_url:imageUpload.secure_url
    }
    //Eliminar el archivo temp del directorio uploads
    await fs.unlink(req.files.image.tempFilePath)
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
//Cargar la informacion del portafolio

    //Verificar el id del portafolio sea el mismo
    const portfolio = await Portfolio.findById(req.params.id).lean()
    //Si es TRUE continuar con la edicion y si es FALSE enviar a la ruta de portafolios
    
    
    if(req.files?.image) {
        //Vamos a realizar la atualizacion de la imagen
        
        //Primero validamos que venga una imagen en el formulario
        if(!(req.files?.image)) return res.send("Se requiere una imagen")
        //Eliminar la imagen en cloudinary
        await deleteImage(portfolio.image.public_id)
        //Cargar la nueva imagen
        const imageUpload = await uploadImage(req.files.image.tempFilePath)
        //Costruir la data para actualizar en la BD
        const data ={
            title:req.body.title || portfolio.name,//Se mantenga todos lo que esta en los inputs
            category: req.body.category || portfolio.category,
            description:req.body.description || portfolio.description,
            image : {
            public_id:imageUpload.public_id,
            secure_url:imageUpload.secure_url
            }
        }
        //Eliminar la imagen temporal
        await fs.unlink(req.files.image.tempFilePath)
        //Actualizar en BD findByIdAndUpdate
        await Portfolio.findByIdAndUpdate(req.params.id,data)
    }
    else{
        //Vamos a hacer la actualizacion de los campos sin imagen
        const {title,category,description}= req.body
        await Portfolio.findByIdAndUpdate(req.params.id,{title,category,description})
    }
    res.redirect('/portafolios')
}

const deletePortafolio = async(req,res)=>{
    //Apartir del modelo usar el metodo findByIdAndDelete
    const portafolio = await Portfolio.findByIdAndDelete(req.params.id)
    //Invocar al metodo y pasar el ID
    await deleteImage(portafolio.image.public_id)
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