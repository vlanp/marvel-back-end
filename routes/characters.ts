import express from "express";
import isArgumentValid from "../middlewares/argumentValidation";
import {
  EArgumentType,
  EParameterType,
} from "../interfaces/ArgumentValidation";
import axios, { AxiosResponse } from "axios";
import ICharacters, { isCharacters } from "../interfaces/Characters";
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

router.get(
  "/characters/:comicid",
  isArgumentValid({
    argumentName: "comicid",
    argumentType: EArgumentType.STRING,
    parameterType: EParameterType.PARAMS,
    stringOption: {
      argumentMinLength: 1,
    },
  }),
  async (req, res, next) => {
    try {
      const endpoint = "/characters";
      const _limit = 100;
      const url =
        process.env.MARVEL_BASE_API_URL +
        endpoint +
        "?apiKey=" +
        process.env.MARVEL_API_SECRET +
        "&limit=" +
        _limit;

      const response = await axios.get<ICharacters>(url);

      if (!isCharacters(response.data)) {
        throw new Error("Unexpected response from marvel's API");
      }

      const count: number = response.data.count;
      const nbRequest = Math.ceil((count - 100) / _limit);

      const arrayOfPromises: Array<
        Promise<axios.AxiosResponse<ICharacters, any>>
      > = [];
      for (let i = 1; i <= nbRequest; i++) {
        const skip = 100 * i;
        const newUrl = url + "&skip=" + skip;
        const promiseResponse = axios.get(newUrl);
        arrayOfPromises.push(promiseResponse);
      }

      const responseList = await Promise.all(arrayOfPromises);

      responseList.push(response);

      const characterList = responseList.flatMap(
        (response) => response.data.results
      );

      const isNameValidFunction = isArgumentValid({
        argumentName: "name",
        argumentType: EArgumentType.STRING,
        parameterType: EParameterType.QUERY,
        isMiddleware: false,
      });
      const isNameValid = isNameValidFunction(req, res, next);

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

      const { comicid } = req.params;
      const { name } = req.query;
      let limit = Number(req.query.limit);
      let skip = Number(req.query.skip);

      const regex = isNameValid && new RegExp(name as string, "i");

      let filteredCharacterList = characterList.filter((character) => {
        return (
          character.comics.includes(comicid) &&
          (regex ? regex.test(character.name) : true)
        );
      });

      const _count = filteredCharacterList.length;

      skip = isSkipValid ? skip : 0;
      limit = isLimitValid ? limit : 100;
      filteredCharacterList = filteredCharacterList.filter(
        (_character, index) => {
          return index > skip - 1 && index <= skip - 1 + limit;
        }
      );

      const characters: ICharacters = {
        count: _count,
        limit: limit,
        results: filteredCharacterList,
      };

      res.status(200).json(characters);
    } catch (error: unknown) {
      res.status(500).json(error);
    }
  }
);

export default router;
