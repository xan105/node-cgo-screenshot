/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { promisify } from "node:util";
import { parse, join } from "node:path";
import { resolve, dirname } from "@xan105/fs/path";
import { exists, mkdir } from "@xan105/fs";
import { Failure } from "@xan105/error";
import { shouldStringNotEmpty, shouldBoolean } from "@xan105/is/assert";
import ffi from "ffi-napi";

const file = join(dirname(import.meta.url), "/dist/souvenir.dll")
             .replace('app.asar', 'app.asar.unpacked'); //electron asar friendly

const lib = ffi.Library(file, {
  "capture": ["uint", ["string"]]
});

async function screenshot(filePath, overwrite = false) {

  shouldStringNotEmpty(filePath);
  shouldBoolean(overwrite);

	const file = parse(filePath);
	
	if (!file.ext || file.ext === ".") filePath += ".png";
	else if (file.ext !== ".png") filePath = filePath.replace(file.ext,".png");

	const target = file.dir;
    
	if (overwrite === false && await exists(filePath) === true)
    throw new Failure(`Target "${file.name}" already exists !`, "ERR_SCREENSHOT_ALREADY_EXISTS");
	if (await exists(target) === false ) await mkdir(target);
  
	const resultPath = resolve(filePath);
	
	const CODES = {
    1: "ERR_SCREENSHOT_CAPTURING_BOUNDS",
    2: "ERR_SCREENSHOT_CREATING_FILE",
    3: "ERR_SCREENSHOT_ENCODING_PNG"
	};
	
  const result = await promisify(lib.capture.async)(filePath);
  if(result === 0) return resultPath;
  else throw new Failure("Fail to take screenshot !", CODES[result] ?? 0);
}

export { screenshot };