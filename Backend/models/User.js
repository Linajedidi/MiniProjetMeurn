const mongoose = require ('mongoose');
//Définir le schéma utilisateur
const UserSchema= new mongoose.Schema({
username:{
    type : String, 
    required : true,

},
email : {
    type : String,
    required : true ,
    unique : true ,
},
password :{
    type : String ,
    required : true ,

},
role: { 
    type: String, 
    enum: ["ADMIN", "CANDIDAT", "ENTREPRISE"], 
    default: "CANDIDAT" 
}


});
//creer un modele base sure ce schéma
const User = mongoose.model('User',UserSchema);
module.exports = User; 

