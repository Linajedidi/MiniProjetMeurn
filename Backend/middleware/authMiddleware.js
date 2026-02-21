const jwt= require('jsonwebtoken');
const config= require("config");

const authMiddleware=(req,res,next)=>{
    const JWT_SECRET=config.get("jwtSecret");
    const token=req.headers.autorization?.split(' ')[1];//beare de token il va prendre le token pui va le elinminer le espaces pour le condition
    if (!token) return res.status(401).json({message:'Accés refusé'});
     try {
        const decoded=jwt.verify(token,JWT_SECRET);
        req.user=decoded; //contient id et name
        next();
     }
     catch(err){
        res.status(401).json({message :'Token invalide'});
     }
};
module.exports = authMiddleware;