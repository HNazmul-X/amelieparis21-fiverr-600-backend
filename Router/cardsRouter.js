const { createCardPostController, getAllCardController: getAllController, getSingleCardData, getCardDeliveryData } = require("../Controller/cardsController");
const { isAuthenticated } = require("../Middleware/isAuthenticated");

const cardsRouter = require("express").Router();

cardsRouter.post("/create-card", isAuthenticated, createCardPostController);
cardsRouter.get("/get-all-card/all", getAllController);
cardsRouter.get("/get-single-card/:id", isAuthenticated, getSingleCardData);
cardsRouter.get("/get-card-delivery-info/:cardId",isAuthenticated,getCardDeliveryData)

module.exports = cardsRouter;
