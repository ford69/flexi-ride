#!/bin/bash

echo "🔄 Restarting backend server with updated CORS configuration..."

# Kill any existing Node.js processes on port 5001
echo "Stopping existing server..."
pkill -f "node.*server.js" || true

# Wait a moment
sleep 2

# Start the server
echo "Starting server..."
cd backend
node server.js &

echo "✅ Backend server restarted!"
echo "📝 Check the logs for CORS requests: tail -f backend/logs/combined-$(date +%Y-%m-%d).log" 