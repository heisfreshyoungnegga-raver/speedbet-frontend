@echo off
cd "C:\Users\Pince N ClawBot\Desktop\ALL SPEEDBET\speedbet-frontend"
echo Installing dependencies...
call npm install
echo Installing dev dependencies...
call npm install -D @types/react @types/react-dom @types/node typescript @vitejs/plugin-react framer-motion lucide-react
echo Building project...
call npm run build
echo DONE!
pause
