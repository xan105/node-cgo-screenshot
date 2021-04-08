cd "%~dp0src\souvenir"
go generate
cd "%~dp0"
set GOPATH="%~dp0"
go build -buildmode=c-shared -o "%~dp0\..\dist\souvenir.dll" souvenir