export const code = Symbol("code");

export class InvalidInput extends Error {
  constructor(public message = "Invalid input") {
    super(message);
    this[code] = 422;
  }
}

export class InvalidInputWithInstructions extends Error {
  constructor(
    public message = "Invalid input. Each Robot need to have its instructions and instructions need to be R, L, or F uppercase without spaces. Min length 0 and length less than 100 characters. Example: '1 1 E\\nRFRFRFRF'"
  ) {
    super(message);
    this[code] = 422;
  }
}
