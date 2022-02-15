const playgroundRouter = require("../playgound/router");
const authRouter = require("./authRouter");
const cardsRouter = require("./cardsRouter");
const profileRouter = require("./profileRouter");
const profileTemplateRouter = require("./ProfileTemplateRouter");
const uploadRouter = require("./uploadRouter");
const userRouter = require("./userRouter");

const routes = [
    {
        path: "/playground",
        handler: playgroundRouter,
    },
    {
        path: "/api/user",
        handler: userRouter,
    },
    {
        path: "/api/card",
        handler: cardsRouter,
    },
    {
        path: "/api/upload",
        handler: uploadRouter,
    },
    {
        path: "/api/auth",
        handler: authRouter,
    },
    {
        path: "/api/profile-template",
        handler: profileTemplateRouter,
    },
    {
        path: "/api/profile",
        handler: profileRouter,
    },
];

exports.connectRoute = (app) => {
    routes.forEach((route) => {
        app.use(route.path, route.handler);
    });
};
