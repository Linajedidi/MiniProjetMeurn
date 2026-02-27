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
password :{
    type : String ,
    required : true ,

},
role: { 
    type: String, 
    enum: ["ADMIN", "CANDIDAT", "ENTREPRISE"], 
    default: "CANDIDAT" 
},

profileImage: {
  type: String,
  default: "http://localhost:3001/uploads/avatar.png"
}



});
const User = mongoose.model('User',UserSchema);
module.exports = User; 

