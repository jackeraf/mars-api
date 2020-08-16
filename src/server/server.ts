"use strict";

require("dotenv").config();
const express = require("express");
const server = express();
const helmet = require("helmet");
const errorHandlers = require("../middlewares/errors");
const marsController = require("../controllers/mars");

server.use(helmet());
server.use("/mars-input", marsController);
server.use(errorHandlers);

module.exports = server;
