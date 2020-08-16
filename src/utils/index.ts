export const getRobotsPositions = (input: string) => {
  const regexRobotPosition = /(\d+) (\d+) [NESW]/g;
  return input.match(regexRobotPosition);
};

export const getInstructions = (input: string) => {
  const regexFollowInstructions = /[RLF]+/g;
  return input.match(regexFollowInstructions);
};

export const isPositionWithInstructions = (input: string) => {
  const maxLength = 100;
  const minLength = 1;
  if (
    typeof input !== "string" ||
    input.length >= maxLength ||
    input.length < minLength ||
    !getRobotsPositions(input) ||
    !getInstructions(input) ||
    getRobotsPositions(input).length !== getInstructions(input).length
  )
    return false;
  return true;
};

export const validateInput = (input: string) => {
  const match = /^(\d+) (\d+)\n((\d+ \d+ [NESW]\n[RLF]+\n?)+)$/m.test(input);
  if (!match) return false;
  return true;
};
