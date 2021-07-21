@echo off
echo Downloading!
start cmd /c npm install
echo Building!
start cmd /c tsc --build
echo Uploading!
git add .
git commit -m "%1 <AutoUpload>"
git push origin master
exit /B