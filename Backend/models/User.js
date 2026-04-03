const mongoose = require ('mongoose');
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
 password: {
    type: String,
    required: function () {
      return !this.googleId; 
    },
  },

  googleId: {  
    type: String,
  },
role: { 
    type: String, 
    enum: ["ADMIN", "CANDIDAT", "ENTREPRISE"], 
    default: "CANDIDAT" 
},
  isActive: { type: Boolean, default: true }, 


profileImage: {
  type: String,
  default: "http://localhost:3001/uploads/avatar.png"
},

resetPasswordToken: {
  type: String,
},
resetPasswordExpire: {
  type: Date,
},
status: {
  type: String,
  enum: ["EN_ATTENTE", "ACCEPTE", "REFUSE"],
  default: "EN_ATTENTE"
},

// Infos entreprise
nomEntreprise: String,
secteur: String,
adresse: String,
description: String,
tel: String,
codeFiscal: String,



});
const User = mongoose.model('User',UserSchema);
module.exports = User; 

