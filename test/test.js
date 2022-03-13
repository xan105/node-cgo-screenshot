import { screenshot } from "../lib/index.js";

screenshot("./dump/hello World2").then(console.log).catch(console.error);
screenshot("./dump/hello World.png").then(console.log).catch(console.error);
screenshot("./dump/In the Name of..").then(console.log).catch(console.error);