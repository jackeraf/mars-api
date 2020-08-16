import {
  validateInput,
  getRobotsPositions,
  getInstructions,
  isPositionWithInstructions,
} from "../utils/index";
const { getRobot } = require("../models/Robot");
const request = require("supertest");
const server = require("../server/server");
import Grid from "../models/Grid";
import { IOrientation } from "../types/index";

describe("Errors check", () => {
  it("should throw error if input format is not correct", () => {
    const input = `
    5 3
    0 3 W`;
    expect(validateInput(input)).toBe(false);
    expect.assertions(1);
  });
  it("should not throw error if input format is correct", () => {
    const input = `
5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL`;
    expect(validateInput(input)).toBe(true);
    expect.assertions(1);
  });
  it("should throw error if length of getRobotsPositions and getInstructions are not equal", () => {
    const input = `
    5 3
    0 3 W`;
    expect(isPositionWithInstructions(input)).toBe(false);
    expect.assertions(1);
  });
  it("should throw error if grid is greater than 50", () => {
    const input = `
51 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL`;
    const gridRegex = /(\d+) (\d+)\n/;
    const gridMatch = input.match(gridRegex);
    const nums = gridMatch[0].split(" ");
    expect(() => new Grid(+nums[0], +nums[1])).toThrow(
      "Invalid limitX should be less or equal to 50 and greater than or equal to 0"
    );
    expect.assertions(1);
  });
  it("should throw error if instruction is greater than 100 characters", () => {
    const input = `
5 3
1 1 E
RFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRF`;
    expect(isPositionWithInstructions(input)).toBe(false);
    expect.assertions(1);
  });
});

describe("Final robot positions", () => {
  const grid = new Grid(5, 3);
  it("should output 1 1 E given 1 1 E as input", () => {
    const input = `
5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL`;
    const [x, y, orientation] = getRobotsPositions(input)[0].split(" ");
    const instruction = getInstructions(input)[0];
    const Robot = getRobot(grid);
    const robot = new Robot(+x, +y, orientation as IOrientation);
    expect(robot.getFinalPositionAfterInstructions(instruction)).toBe("1 1 E");
    expect.assertions(1);
  });
  it("should output 3 3 N LOST given 3 2 N as input", () => {
    const input = `
5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL`;
    const [x, y, orientation] = getRobotsPositions(input)[1].split(" ");
    const instruction = getInstructions(input)[1];
    const Robot = getRobot(grid);
    const robot = new Robot(+x, +y, orientation as IOrientation);
    expect(robot.getFinalPositionAfterInstructions(instruction)).toBe(
      "3 3 N LOST"
    );
    expect.assertions(1);
  });

  it("should output 2 3 S LOST given 0 3 W as input", () => {
    const input = `
5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL`;
    const [x, y, orientation] = getRobotsPositions(input)[2].split(" ");
    const instruction = getInstructions(input)[2];
    const Robot = getRobot(grid);
    const robot = new Robot(+x, +y, orientation as IOrientation);
    expect(robot.getFinalPositionAfterInstructions(instruction)).toBe("2 3 S");
    expect.assertions(1);
  });
});

describe("Integration tests ", () => {
  beforeAll((done) => {
    done();
  });
  afterAll((done) => {
    server.close();
    done();
  });
  it("should get 200 response from endpoint POST mars-input", async () => {
    const res = await request(server)
      .post("/mars-input")
      .send(
        `input=5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL`
      )
      .set("Accept", "application/json");
    expect(res.status).toBe(200);
    expect.assertions(1);
  });
  it("should get 422 response from endpoint POST mars-input", async () => {
    const res = await request(server)
      .post("/mars-input")
      .send(
        `input=5 3
      1 1 E
      3 2 N
      FRRFLLFFRRFLL
      0 3 W
      LLFFFLFLFL`
      )
      .set("Accept", "application/json; charset=utf-8");
    expect(res.status).toBe(422);
    expect.assertions(1);
  });
});
