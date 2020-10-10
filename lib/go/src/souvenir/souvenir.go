//go:generate goversioninfo -platform-specific=true

package main

 import (
  "log"
  "C"
  "path/filepath"
  "screenshot"
  "image"
  "image/png"
  "os"
  "fmt"
  "strings"
 )
 
 //export capture
 func capture(dirPath *C.char, fileName *C.char) *C.char {
 
  filter := [2]string{"\\/:", "*?\"<>|\n\r\t"} //Invalid Windows path symbols
  dir := clean(C.GoString(dirPath),filter[1])
  name := clean(C.GoString(fileName),filter[0]+filter[1])

  bounds := getCurrentActiveDisplay()
  img, err := screenshot.CaptureRect(bounds)
 		if err != nil {
 			log.Fatal(err)
 		}
  err = os.MkdirAll(dir, os.ModePerm)
 		if err != nil {
 			log.Fatal(err)
 		}
 		
   target:= fmt.Sprintf("%s.png", name)
   pngPath := filepath.Join(dir,target)
   file, _ := os.Create(pngPath)
   defer file.Close()
   png.Encode(file, img)
   return C.CString(pngPath)
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
 
 func clean(str, chr string) string {
    return strings.Map(func(r rune) rune {
        if strings.IndexRune(chr, r) < 0 {
            return r
        }
        return -1
    }, str)
 }
 
 func main() {}