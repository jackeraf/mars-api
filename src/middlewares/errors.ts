"use strict";

const { code } = require("../models/Errors");

const errorHandler = (err, req, res, next) => {
  const message = err[code] ? err.message : "Internal Server Error";

  res.status(err[code] || 500).json({
    message,
    stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
  });
};

module.exports = [errorHandler];
