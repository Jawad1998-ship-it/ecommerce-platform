import express from "express";
import * as CountryController from "../controllers/country.controller.js";
import { protectedRoute } from "../../../middlewares/authJwt.js";

const countryRouter = express.Router();

countryRouter.get("/", CountryController.getCountries);

export default (app) => {
  app.use("/api/countries", countryRouter);
};
