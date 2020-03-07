@echo off
title Building
start cmd /c "tsc --build 2>log >log2"
ping 127.0.0.1 > nul
ping 127.0.0.1 > nul
ping 127.0.0.1 > nul
ping 127.0.0.1 > nul
type log
type log2
del D:\APPS\JSAICore\UnderDeny.js
copy .\UnderDeny.js D:\APPS\JSAICore\UnderDeny.js