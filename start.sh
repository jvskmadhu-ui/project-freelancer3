#!/usr/bin/env bash
echo "==================================================="
echo "  Starting FreelanceHub 3D Marketplace Platform"
echo "==================================================="

# Start Backend
echo "Starting Spring Boot 3 Backend on port 8080..."
(cd backend && mvn spring-boot:run) &
BACKEND_PID=$!

# Wait for backend
sleep 5

# Start Frontend
echo "Starting React Vite Frontend on port 5173..."
(cd frontend && npm run dev -- --host 0.0.0.0 --port 5173) &
FRONTEND_PID=$!

sleep 3
echo "==================================================="
echo "  FreelanceHub 3D is now live!"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:8080/api"
echo "==================================================="

wait $BACKEND_PID $FRONTEND_PID
