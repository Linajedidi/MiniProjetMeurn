const express=require("express");
const mongoose=require("mongoose");
const config=require("config");
const cors=require("cors");


const app=express();
app.use(express.json());
app.use(cors());
const mongo_url=config.get("mongo_url");
mongoose.set("strictQuery",true);
mongoose.connect(mongo_url).then(()=>console.log("MongoDBconnected...")).catch((err)=>console.log(err));

const port =process.env.PORT || 3001;
app.listen(port,()=>console.log(`server ranning on port ${port}`));


