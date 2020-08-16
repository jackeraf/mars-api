"use strict";

import { IOrientation, IInstructions } from "../types/index";
import { InvalidInput } from "./Errors";

interface IPosition {
  x: number;
  y: number;
}

function getRobot(grid) {
  return class Robot {
    private position: IPosition;
    private isLost: boolean = false;
    private movements: { [key in IOrientation]: { x: number; y: number } } = {
      N: {
        x: 0,
        y: 1,
      },
      E: {
        x: 1,
        y: 0,
      },
      S: {
        x: 0,
        y: -1,
      },
      W: {
        x: -1,
        y: 0,
      },
    };
    private rotation: {
      [key in IOrientation]: { L: IOrientation; R: IOrientation };
    } = {
      N: {
        L: "W",
        R: "E",
      },
      E: {
        L: "N",
        R: "S",
      },
      S: {
        L: "E",
        R: "W",
      },
      W: {
        L: "S",
        R: "N",
      },
    };
    constructor(x: number, y: number, private orientation: IOrientation) {
      if (grid.isOffGrid(x, y)) {
        throw new InvalidInput("x or y values are out of grid!");
      }
      this.position = {
        x,
        y,
      };
    }
    getPosition(): IPosition {
      return this.position;
    }
    getOrientation(): IOrientation {
      return this.orientation;
    }
    setOrientation(orientation: "R" | "L"): void {
      this.orientation = this.rotation[this.orientation][orientation];
    }
    move(instruction: IInstructions) {
      const moveX = this.position.x + this.movements[this.orientation]["x"];
      const moveY = this.position.y + this.movements[this.orientation]["y"];
      if (
        grid.isScentedPosition(
          this.position.x,
          this.position.y,
          this.orientation
        )
      ) {
        if (instruction !== "F") {
          this.position.x = moveX;
          this.position.y = moveY;
        }
      } else {
        if (grid.isOffGrid(moveX, moveY)) {
          this.isLost = true;
          grid.addScentedPosition(
            this.position.x,
            this.position.y,
            this.orientation
          );
        } else {
          this.position.x = moveX;
          this.position.y = moveY;
        }
      }
    }
    getFinalPositionAfterInstructions(instructions: IInstructions) {
      const instructionsArr = instructions.split("") as IInstructions[];
      for (let i = 0; i < instructionsArr.length; i++) {
        if (this.isLost) {
          return `${this.position.x} ${this.position.y} ${this.orientation} LOST`;
        }
        const instruction = instructionsArr[i];
        if (instruction == "L" || instruction == "R") {
          this.setOrientation(instruction);
        } else {
          this.move(instruction);
        }
      }
      return `${this.position.x} ${this.position.y} ${this.orientation}`;
    }
  };
}
module.exports.getRobot = getRobot;
