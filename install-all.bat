@echo off
cd "C:\Users\Pince N ClawBot\Desktop\ALL SPEEDBET\speedbet-frontend"
echo Installing ALL dependencies...
call npm install
echo Dependencies installed. Now building...
call npm run build
echo Build complete!
pause
