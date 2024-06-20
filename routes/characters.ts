import express from "express";
import isArgumentValid from "../middlewares/argumentValidation";
import {
  EArgumentType,
  EParameterType,
} from "../interfaces/ArgumentValidation";
import axios from "axios";
import { isCharacters } from "../interfaces/Characters";
import { isAboutACharacter } from "../interfaces/AboutACharacter";

const router = express.Router();

router.get("/characters", async (req, res, next) => {
  try {
    const { limit, skip, name } = req.query;

    const isLimitValidFunction = isArgumentValid({
      argumentName: "limit",
      argumentType: EArgumentType.NUMBER,
      parameterType: EParameterType.QUERY,
      numberOption: {
        argumentMinValue: 1,
        argumentMaxValue: 100,
        mustBeInteger: true,
      },
      isMiddleware: false,
    });
    const isLimitValid = isLimitValidFunction(req, res, next);

    const isSkipValidFunction = isArgumentValid({
      argumentName: "skip",
      argumentType: EArgumentType.NUMBER,
      parameterType: EParameterType.QUERY,
      numberOption: {
        mustBeInteger: true,
      },
      isMiddleware: false,
    });
    const isSkipValid = isSkipValidFunction(req, res, next);

    const isNameValidFunction = isArgumentValid({
      argumentName: "name",
      argumentType: EArgumentType.STRING,
      parameterType: EParameterType.QUERY,
      isMiddleware: false,
    });
    const isNameValid = isNameValidFunction(req, res, next);

    const endpoint = "/characters";
    const url =
      process.env.MARVEL_BASE_API_URL +
      endpoint +
      "?apiKey=" +
      process.env.MARVEL_API_SECRET +
      (isLimitValid ? "&limit=" + limit : "") +
      (isSkipValid ? "&skip=" + skip : "") +
      (isNameValid ? "&name=" + name : "");

    const response = await axios.get(url);

    if (!isCharacters(response.data)) {
      throw new Error("Unexpected response from marvel's API");
    }

    res.status(200).json(response.data);
  } catch (error: unknown) {
    res.status(500).json(error);
  }
});

router.get(
  "/character/:characterid",
  isArgumentValid({
    argumentName: "characterid",
    argumentType: EArgumentType.STRING,
    parameterType: EParameterType.PARAMS,
    stringOption: {
      argumentMinLength: 1,
    },
  }),
  async (req, res) => {
    try {
      const { characterid } = req.params;

      const endpoint = "/character";
      const url =
        process.env.MARVEL_BASE_API_URL +
        endpoint +
        "/" +
        characterid +
        "?apiKey=" +
        process.env.MARVEL_API_SECRET;

      const response = await axios.get(url);

      if (!isAboutACharacter(response.data)) {
        throw new Error("Unexpected response from marvel's API");
      }

      res.status(200).json(response.data);
    } catch (error: unknown) {
      res.status(500).json(error);
    }
  }
);

export default router;
