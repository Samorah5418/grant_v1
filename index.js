require("dotenv").config();
const express = require("express");
const app = express();
const connectDb = require("./utils/connectDb");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const routeNotFound = require("./utils/notFound");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const User = require("./models/UserModel");

app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(fileUpload({ useTempFiles: true }));
app.use("/", userRoute);
app.use(routeNotFound);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables.");
    }

    await connectDb(process.env.MONGO_URI);
    const server = app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });

    const shutdown = () => {
      server.close(() => {
        console.log("Server closed. Exiting process.");
        mongoose.connection.close();
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Error starting server:", error);
  }
};






startServer();
