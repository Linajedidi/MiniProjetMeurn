const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");
const authRoutes = require("./routes/auth");



const users = require("./routes/api/Users");
const userRoutes = require("./routes/api/userRoutes"); 
const candidaturesRoute = require("./routes/api/candidatures");
const offreRoutes = require("./routes/api/offreRoutes");
const stats=require("./routes/api/stats");
const path = require("path"); 
const notificationsRoutes = require("./routes/api/notifications")

const app = express(); 

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000",
  credentials: true
}));

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

const mongo_url=config.get("mongo_url");
mongoose.set("strictQuery",true);
mongoose.connect(mongo_url).then(()=>console.log("MongoDBconnected...")).catch((err)=>console.log(err));
app.use("/users",users);

app.use("/api/candidatures", candidaturesRoute);
app.use("/api", offreRoutes);

app.use("/api/notifications", notificationsRoutes)

app.use("/api/admin/entreprises", require("./routes/api/adminEntr"));


app.use("/api/users", userRoutes);
app.use("/api/stats", stats);
//app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/api/Users"));

app.use("/api/cv", require("./routes/api/cv.routes"));

app.use("/auth", authRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);
