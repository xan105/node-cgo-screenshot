//go:generate goversioninfo -platform-specific=true

/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

package main

 import (
  "C"
  "screenshot"
  "image"
  "image/png"
  "os"
 )
 
 //export capture
 func capture(filePath *C.char) C.uint {

  bounds := getCurrentActiveDisplay()
  img, err := screenshot.CaptureRect(bounds)
 	if err != nil {
 		return C.uint(1)
 	}
 	
  file, err := os.Create(C.GoString(filePath))
    if err != nil {
 		return C.uint(2)
 	}
  defer file.Close()
  
  err = png.Encode(file, img)
    if err != nil {
 		return C.uint(3)
 	}
 	
   return C.uint(0)
 }
 
func getCurrentActiveDisplay() image.Rectangle {
	var bounds image.Rectangle
	
	n := screenshot.NumActiveDisplays()
	
	for i := 0; i < n; i++ {
		bounds = screenshot.GetDisplayBounds(i)
		//The primary display device is supposed to be always located at coordinates (0,0)
		if (bounds.Min.X == 0 && bounds.Min.Y == 0) { break }
	}
	
	return bounds
}

func main() {}