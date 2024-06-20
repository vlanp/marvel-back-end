import express from "express";
import isArgumentValid from "../middlewares/argumentValidation";
import {
  EArgumentType,
  EParameterType,
} from "../interfaces/ArgumentValidation";
import axios from "axios";
import { isComics } from "../interfaces/Comics";
import { isComicsWithCharacter } from "../interfaces/ComicsWithCharacter";
import { isAboutAComic } from "../interfaces/AboutAComic";

const router = express.Router();

router.get("/comics", async (req, res, next) => {
  try {
    const { limit, skip, title } = req.query;

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

    const isTitleValidFunction = isArgumentValid({
      argumentName: "title",
      argumentType: EArgumentType.STRING,
      parameterType: EParameterType.QUERY,
      isMiddleware: false,
    });
    const isTitleValid = isTitleValidFunction(req, res, next);

    const endpoint = "/comics";
    const url =
      process.env.MARVEL_BASE_API_URL +
      endpoint +
      "?apiKey=" +
      process.env.MARVEL_API_SECRET +
      (isLimitValid ? "&limit=" + limit : "") +
      (isSkipValid ? "&skip=" + skip : "") +
      (isTitleValid ? "&title=" + title : "");

    const response = await axios.get(url);

    if (!isComics(response.data)) {
      throw new Error("Unexpected response from marvel's API");
    }

    res.status(200).json(response.data);
  } catch (error: unknown) {
    res.status(500).json(error);
  }
});

router.get(
  "/comics/:characterid",
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

      const endpoint = "/comics";
      const url =
        process.env.MARVEL_BASE_API_URL +
        endpoint +
        "/" +
        characterid +
        "?apiKey=" +
        process.env.MARVEL_API_SECRET;

      const response = await axios.get(url);

      if (!isComicsWithCharacter(response.data)) {
        throw new Error("Unexpected response from marvel's API");
      }

      res.status(200).json(response.data);
    } catch (error: unknown) {
      res.status(500).json(error);
    }
  }
);

router.get(
  "/comic/:comicid",
  isArgumentValid({
    argumentName: "comicid",
    argumentType: EArgumentType.STRING,
    parameterType: EParameterType.PARAMS,
    stringOption: {
      argumentMinLength: 1,
    },
  }),
  async (req, res) => {
    try {
      const { comicid } = req.params;

      const endpoint = "/comic";
      const url =
        process.env.MARVEL_BASE_API_URL +
        endpoint +
        "/" +
        comicid +
        "?apiKey=" +
        process.env.MARVEL_API_SECRET;

      const response = await axios.get(url);

      if (!isAboutAComic(response.data)) {
        throw new Error("Unexpected response from marvel's API");
      }

      res.status(200).json(response.data);
    } catch (error: unknown) {
      res.status(500).json(error);
    }
  }
);

export default router;
