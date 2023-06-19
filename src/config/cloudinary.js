//Invocacion de la libreria cloundinary
const cloudinary = require('cloudinary').v2


cloudinary.config({ 
    //Llamar a las cariables del archivo .env
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
    secure: true
});

//Exportacion del por default del metodo uploadImage
module.exports.uploadImage = async(filePath) => {
    //Subir la imagen de la ruta (FILEPATH) en la carpeta portafolio
    return await cloudinary.uploader.upload(filePath,{folder:'portafolio'})
}

//Esportacion por default del metodo deleteImage
module.exports.deleteImage = async (publicId)=>{
    //Eliminar la imagen en base al ID
    return await cloudinary.uploader.destroy(publicId)
}