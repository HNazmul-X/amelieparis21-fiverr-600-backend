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
    .connect(`mongodb://ONECARDPRO_OWNEr:44c857302f2e0ce0a7ae3ac62402f439b8ac4315@193.43.134.200:27017/OnecardPro`)
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
