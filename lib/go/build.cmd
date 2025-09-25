cd "%~dp0src\souvenir"
go generate
cd "%~dp0"
set GOPATH="%~dp0"
go build -trimpath -buildmode=c-shared -ldflags "-w -s -buildid=" -o "%~dp0\..\dist\souvenir.dll" souvenir