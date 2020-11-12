"use strict"

const screenshot = require("../lib/index.cjs");

screenshot("./dump/hello World.png").then(console.log).catch(console.error);