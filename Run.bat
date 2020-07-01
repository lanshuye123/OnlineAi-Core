@echo off
@cls
start D:\APPS\MIRAI\Run.bat
:Core
Node --inspect=9222 OnlineAi.js
if exist _NotReStart exit
goto Core