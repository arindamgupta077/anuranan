@echo off
echo === Quick Version Update ===
echo.
echo This will update all CSS and JS file versions with a timestamp.
echo.
pause

powershell -ExecutionPolicy Bypass -File "%~dp0update-version.ps1"

pause
