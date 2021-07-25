@echo off
@cls
start D:\APPS\MIRAI\Run.bat
git pull
ping 127.0.0.1 > nul
ping 127.0.0.1 > nul
ping 127.0.0.1 > nul
:Core
Node --inspect=9222 OnlineAi.js
git add .
git commit -m "Common Updte"
git push
if exist _NotReStart exit
goto Core