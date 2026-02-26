#!/bin/bash

# HEALX Health Platform Setup Script

echo "================================"
echo "HEALX Health Platform Setup"
echo "================================"

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "Node.js not found. Please install Node.js 18+"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "Python not found. Please install Python 3.9+"
    exit 1
fi

if ! command -v mongod &> /dev/null; then
    echo "MongoDB not found. Please install MongoDB 4.4+"
    exit 1
fi

echo "Prerequisites OK!"

# Backend setup
echo ""
echo "Setting up Backend..."
cd server
npm install
cp .env.example .env
echo "Edit .env file with your configuration"
npm run seed
cd ..

# Frontend setup
echo ""
echo "Setting up Frontend..."
cd client
npm install
cp .env.example .env
cd ..

# AI Service setup
echo ""
echo "Setting up AI Service..."
cd ai-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate
cd ..

echo ""
echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd server && npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd client && npm start"
echo ""
echo "Terminal 3 (AI Service):"
echo "  cd ai-service"
echo "  source venv/bin/activate  (or venv\\Scripts\\activate on Windows)"
echo "  python main.py"
echo ""
echo "Access: http://localhost:3000"
echo "Default credentials: admin@healx.com / Admin@123456"
echo ""
