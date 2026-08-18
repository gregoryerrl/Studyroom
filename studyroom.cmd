@echo off
REM Studyroom launcher for Windows. The real logic is app/start.js; `start` is the POSIX twin.
REM Named studyroom.cmd and NOT start.cmd on purpose: `start` is a cmd.exe builtin, so a bare
REM `start` in this folder would run the builtin instead of this file.
node "%~dp0app\start.js" %*
