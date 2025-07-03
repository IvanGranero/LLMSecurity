const express = require("express");
const router = express.Router();
const controller = require("../controller/app");

let routes = (app) => {
  router.post("/api/login", controller.login); 
  router.post("/api/register", controller.register);
  router.post("/api/submitprompt", controller.authenticateJWT, controller.submitprompt);
  router.post("/api/submitsettings", controller.authenticateJWT, controller.submitsettings);
  router.get("/api/verify/:id/:token", controller.verifyemail);
  router.post("/api/submitflag", controller.authenticateJWT, controller.submitflag);
  router.get("/api/scoreboard", controller.getScoreboard);  
  app.use(router);
};

module.exports = routes;