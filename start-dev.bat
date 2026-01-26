@echo off
set PATH=C:\Program Files\nodejs;C:\Users\kryst\AppData\Roaming\npm;%PATH%
set NODE_ENV=development
echo Starting development server with NODE_ENV=%NODE_ENV%
npx tsx watch server/_core/index.ts
