const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

module.exports = (app) => {
    const allMiddleware = [express.static("public"), express.json(), express.urlencoded({ extended: true }), cors(), morgan("dev")];

    if (app) {
        allMiddleware.forEach((middleware) => app.use(middleware));
        app.use(express.static("/public"))
    }
};
