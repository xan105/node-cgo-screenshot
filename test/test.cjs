"use strict"

const screenshot = require("../lib/index.cjs");

screenshot("./dump","helloWorld").then(console.log).catch(console.error);
screenshot("./dump/*?","invalidrootdir").then(console.log).catch(console.error);
screenshot("./dump","invalidfile*?:name").then(console.log).catch(console.error);
screenshot("./dump/*?\\\\fb","invalidrootdirfb").then(console.log).catch(console.error);