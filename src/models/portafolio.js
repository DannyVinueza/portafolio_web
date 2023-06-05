const {Schema, model} = require('mongoose')

const portafolioSchema = new Schema(
    {
        title:{
            type:String,
            require:true
        },
        description:{
            type:String,
            require:true
        },
        category:{
            type:String,
            require:true
        }
    },
    {
        timestamps:true
    }
)

module.exports = model('portafolio', portafolioSchema)