import { validateInput } from "../utils/index";
import { InvalidInput } from "../models/Errors";

module.exports.bodyParserCustom = (req, res, next) => {
  const chunks = [];
  req.on("data", (chunk) => {
    const decoded = decodeURIComponent(chunk.toString());
    if (!decoded.match("input=")) {
      return next(
        new InvalidInput(
          "Invalid input or input length needs to be less than 100 characters"
        )
      );
    }
    const input = decoded.replace("input", "").replace("=", "");
    if (!validateInput(input)) {
      return next(
        new InvalidInput(
          "Invalid input or input length needs to be less than 100 characters"
        )
      );
    }
    // the default input gives 87 buffer length and it has 55 characters counting spaces etc
    // then maxInputSize = Math.floor((99 * 87)/55)
    const maxInputSize = 156;
    if (chunk.length > maxInputSize) {
      return next(
        new InvalidInput(
          "Invalid input or input length needs to be less than 100 characters"
        )
      );
    }
    chunks.push(chunk);
  });
  req.on("end", () => {
    // decode form-url-encoded receiving input as key
    const decoded = decodeURIComponent(
      Buffer.concat(chunks).toString().replace("input", "").replace("=", "")
    );
    req.body = decoded;
    return next();
  });
};
