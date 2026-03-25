const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");

const users = require("./routes/api/Users");
const userRoutes = require("./routes/api/userRoutes"); 
const candidaturesRoute = require("./routes/api/candidatures");
const offreRoutes = require("./routes/api/offreRoutes");
const stats=require("./routes/api/stats");
const path = require("path"); 


const app = express();

app.use(express.json());
app.use(cors());
const mongo_url=config.get("mongo_url");
mongoose.set("strictQuery",true);
mongoose.connect(mongo_url).then(()=>console.log("MongoDBconnected...")).catch((err)=>console.log(err));
app.use("/users",users);
app.use("/api/candidatures", candidaturesRoute);
app.use("/api", offreRoutes);




app.use("/api/users", userRoutes);
app.use("/api/stats", stats);
//app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



app.use("/api/cv", require("./routes/api/cv.routes"));


const port = process.env.PORT || 3001;
app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);