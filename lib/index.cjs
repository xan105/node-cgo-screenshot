/*
MIT License

Copyright (c) 2019-2020 Anthony Beaumont

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

"use strict";

const fs = require('fs');
const path = require('path');
const ffi = require('ffi-napi');

const lib = ffi.Library(path.join(__dirname, "go/build/souvenir.dll"), {
   'capture': ["uint", ["string"]],
});

module.exports = async function(filePath, overwrite = false) {

	if(typeof filePath !== 'string' || !filePath) throw "ERR_INVALID_ARG_TYPE";

	const file = path.parse(filePath);
	
	if (!file.ext || file.ext === ".") filePath += ".png";
	else if (file.ext !== ".png") filePath.replace(file.ext,".png");

	const target = file.dir;
    
	if ( overwrite === false && await exists(filePath) === true ) throw "ERR_SCREENSHOT_ALREADY_EXISTS";
	if ( await exists(target) === false ) await mkdir(target);
  
	const resultPath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
	
	const result = await capture(resultPath).catch(()=>{
		throw "ERR_UNEXPECTED_SCREENSHOT_FAILURE_FFI"
	});

	if(result === 0) return resultPath;
	else if(result === 1) throw "ERR_SCREENSHOT_CAPTURING_BOUNDS";
	else if(result === 2) throw "ERR_SCREENSHOT_CREATING_FILE";
	else if(result === 3) throw "ERR_SCREENSHOT_ENCODING_PNG";
	else throw "ERR_UNEXPECTED_SCREENSHOT_FAILURE";
  
}

function capture(filePath) {
  return new Promise((resolve,reject) => {
    lib.capture.async(filePath, function (err, res) {
        if(err) return reject(err);
        return resolve(res);
    });
  });
}

function exists(target) {
   return new Promise((resolve) => {
      fs.promises.access(target, fs.constants.F_OK).then(() => resolve(true)).catch(() => resolve(false));
   });
}

function mkdir(target) {
	return new Promise((resolve,reject) => {
		fs.promises.mkdir(target, { recursive: true }).then(() => resolve()).catch((err) => reject(err));
	});
}