require("dotenv").config();
const express = require("express");
const defaultMiddleware = require("./Middleware/defaultMiddleware");
const app = express();
const PORT = process.env.PORT || 8080;
const mongoose = require("mongoose");
const chalk = require("chalk");
const { connectRoute } = require("./Router/router");

//using Default Middleware
defaultMiddleware(app);

//connecting to Database

mongoose
    .connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@193.43.134.200:27017/One_Card_Pro`)
    .then(() => console.log(chalk.bgGreen.black("database Connection Successful" + `http://localhost:${PORT}`)));

//connecting Router
connectRoute(app);

app.get("/", (req, res) => {
    res.send("hey don't worry I am working");
});

app.use((error, req, res, next) => {
    res.json({ error: error.message });
    next();
});

app.listen(PORT);
