"use strict";
const express = require("express");
const router = express.Router();
const { bodyParserCustom } = require("../middlewares/customBodyParser");
const { getRobot } = require("../models/Robot");
import {
  validateInput,
  getRobotsPositions,
  getInstructions,
  isPositionWithInstructions,
} from "../utils/index";
import Grid from "../models/Grid";
import { IOrientation } from "../types/index";
import { InvalidInput, InvalidInputWithInstructions } from "../models/Errors";

router.post("/", bodyParserCustom, (req, res, next) => {
  const input = req.body;
  if (!validateInput(input)) {
    return next(new InvalidInput("Invalid input"));
  }
  //Create grid

  let grid = null;
  try {
    const gridRegex = /(\d+) (\d+)\n/;
    const gridMatch = input.match(gridRegex);
    const nums = gridMatch[0].split(" ");
    grid = new Grid(+nums[0], +nums[1]);
  } catch (err) {
    return next(err);
  }

  // validate length positions

  if (!isPositionWithInstructions(input)) {
    return next(new InvalidInputWithInstructions());
  }

  // move robots
  let finalOutput = "";
  let length = getRobotsPositions(input).length;
  for (let i = 0; i < length; i++) {
    const [x, y, orientation] = getRobotsPositions(input)[i].split(" ");
    const instruction = getInstructions(input)[i];
    const Robot = getRobot(grid);
    try {
      const robot = new Robot(+x, +y, orientation as IOrientation);
      const newLine = i == length - 1 ? "" : "\n";
      finalOutput +=
        robot.getFinalPositionAfterInstructions(instruction) + newLine;
    } catch (err) {
      return next(err);
    }
  }
  res.status(200).json({
    input,
    output: finalOutput,
  });
});

module.exports = router;
