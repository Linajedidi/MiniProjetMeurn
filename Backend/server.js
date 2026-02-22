const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");

const users = require("./routes/api/Users");
const userRoutes = require("./routes/api/userRoutes");

// ✅ 1️⃣ Créer app AVANT tout app.use
const app = express();

// ✅ 2️⃣ Middlewares globaux
app.use(express.json());
app.use(cors());

// ✅ 3️⃣ Routes
app.use("/api/cv", require("./routes/api/cv.routes"));
app.use("/users", users);
app.use("/users", userRoutes);

// ✅ 4️⃣ MongoDB
const mongo_url = config.get("mongo_url");
mongoose.set("strictQuery", true);

mongoose
  .connect(mongo_url)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

// ✅ 5️⃣ Lancer le serveur
const port = process.env.PORT || 3001;
app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);