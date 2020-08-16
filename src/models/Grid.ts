"use strict";

import { IOrientation } from "../types/index";
import { InvalidInput } from "./Errors";

interface IScentedPositions {
  [key: string]: [IOrientation];
}

class Grid {
  scentedPositions: IScentedPositions = {};
  minLimit: number = 0;
  maxLimit: number = 50;
  constructor(public limitX: number, public limitY: number) {
    this.isLimitValid(limitX, limitY);
  }

  isLimitValid(limitX: number, limitY: number) {
    if (limitX > this.maxLimit || limitX < this.minLimit)
      throw new InvalidInput(
        `Invalid limitX should be less or equal to ${this.maxLimit} and greater than or equal to ${this.minLimit}`
      );
    if (limitY > this.maxLimit || limitY < this.minLimit)
      throw new InvalidInput(
        `Invalid limitY should be less or equal to ${this.maxLimit} and greater than or equal to ${this.minLimit}`
      );
  }

  isOffGrid(x: number, y: number) {
    return (
      x > this.limitX ||
      x < this.minLimit ||
      y > this.limitY ||
      y < this.minLimit
    );
  }

  addScentedPosition(x: number, y: number, orientation: IOrientation): void {
    if (!this.isScentedPosition(x, y, orientation)) {
      // add the scent positions as keys ["x-y"] to have O(1) access
      // we add true to add something as the value because we don't need it
      const position = `${x}-${y}`;
      this.scentedPositions[position] = [orientation];
    }
  }

  isScentedPosition(x: number, y: number, orientation: IOrientation): boolean {
    this.isLimitValid(x, y);
    // the scent positions as keys ["x-y"] to have O(1) access
    const position = `${x}-${y}`;
    if (position in this.scentedPositions) {
      return this.scentedPositions[position].includes(orientation);
    }
    return false;
  }
}

export default Grid;
