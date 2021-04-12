//go:generate goversioninfo -platform-specific=true

/*
MIT License

Copyright (c) 2019-2021 Anthony Beaumont

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