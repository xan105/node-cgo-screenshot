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
	
	if (!file.ext) filePath += ".png";
	else if (file.ext !== ".png") filePath.replace(file.ext,".png");

	const target = file.dir;
    
	if ( overwrite === false && await exists(filePath) === true ) throw "ERR_SCREENSHOT_ALREADY_EXISTS";
  
	if ( await exists(target) === false ) await mkdir(target);
  
	const result = await capture(filePath).catch(()=>{
		throw "ERR_UNEXPECTED_SCREENSHOT_FAILURE_FFI"
	});

	if(result === 0) return path.resolve(filePath);
	else if(result === 1) throw "ERR_SCREENSHOT_CAPTURING_BOUNDS";
	else if(result === 2) throw "ERR_SCREENSHOT_CREATING_FILE";
	else if(result === 3) throw "ERR_SCREENSHOT_ENCODING_PNG";
	else throw "ERR_UNEXPECTED_SCREENSHOT_FAILURE";
  
}

function capture(filePath) {
  return new Promise((resolve,reject) => {
    lib.capture.async(path.resolve(filePath), function (err, res) {
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