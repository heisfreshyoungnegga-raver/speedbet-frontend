@echo off
cd "C:\Users\Pince N ClawBot\Desktop\ALL SPEEDBET\speedbet-frontend"
echo Installing dependencies...
call npm install
call npm install -D @vitejs/plugin-react typescript @types/react @types/react-dom
echo Building project...
call npm run build
echo Done!
pause
