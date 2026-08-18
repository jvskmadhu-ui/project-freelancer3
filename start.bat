@echo off
echo ===================================================
echo   Starting FreelanceHub 3D Marketplace Platform
echo ===================================================

echo Starting Spring Boot 3 Backend on port 8080...
start "FreelanceHub Backend" cmd /k "cd backend && set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.20.8-hotspot && ..\tools\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run"

timeout /t 5 /nobreak > nul

echo Starting React Vite Frontend on port 5173...
start "FreelanceHub Frontend" cmd /k "cd frontend && npm run dev -- --host 0.0.0.0 --port 5173"

timeout /t 3 /nobreak > nul

echo Opening browser at http://localhost:5173...
start http://localhost:5173

echo ===================================================
echo   FreelanceHub 3D is now live!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8080/api
echo ===================================================
