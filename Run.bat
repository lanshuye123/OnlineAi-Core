@echo off
@cls
start D:\APPS\MIRAI\Run.bat
ping 127.0.0.1 > nul
:Core
Node --inspect=9222 OnlineAi.js
if exist _NotReStart exit
goto Core