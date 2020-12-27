"use strict"

const screenshot = require("../lib/index.cjs");

screenshot("./dump/hello World2").then(console.log).catch(console.error);
screenshot("./dump/hello World.png").then(console.log).catch(console.error);
screenshot("./dump/In the Name of..").then(console.log).catch(console.error);