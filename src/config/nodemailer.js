// Importar el modulo
const nodemailer = require("nodemailer");

//Create reusable transporter object using the default SMTP transport
//Cofiguraciones del sercidor SMTP
const transporter = nodemailer.createTransport({
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP
    }
})

//Definir la estruvtura del correo eletronico
module.exports.sendMailToUser = async(userMail,token)=>{
    //El cuerpo del mail
    let info = await transporter.sendMail({
    //De
    from: 'danny@epn.com',
    //Para
    to: userMail,
    //Asunto
    subject: "Verifica tu cuenta de correo electrónico",
    //Cuerpo del mail
    html: `<a href="http://localhost:3000/user/confirmar/${token}">Clic para confirmar tu cuenta</a>`,
    });
    //Verificar en consola
    console.log("Message sent: %s", info.messageId);
}