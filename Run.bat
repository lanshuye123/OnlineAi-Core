@echo off
@cls
:Core
Node OnlineAI.js
if exist _NotReStart exit
goto Core