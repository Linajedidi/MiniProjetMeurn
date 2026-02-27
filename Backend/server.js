const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");

const users = require("./routes/api/Users");
const userRoutes = require("./routes/api/userRoutes"); 
const stats=require("./routes/api/stats");

// ✅ 1️⃣ Créer app AVANT tout app.use
const app = express();

// ✅ 2️⃣ Middlewares globaux
app.use(express.json());
app.use(cors());
const mongo_url=config.get("mongo_url");
mongoose.set("strictQuery",true);
mongoose.connect(mongo_url).then(()=>console.log("MongoDBconnected...")).catch((err)=>console.log(err));
app.use("/users",users);
app.use("/api/users", userRoutes);
app.use("/api/stats", stats);
app.use("/uploads", express.static("uploads"));

// ✅ 3️⃣ Routes
app.use("/api/cv", require("./routes/api/cv.routes"));

// ✅ 5️⃣ Lancer le serveur
const port = process.env.PORT || 3001;
app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);