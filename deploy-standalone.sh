#!/bin/bash

# PrePost Standalone - Production Deployment Script
# This script automates the deployment process

set -e  # Exit on error

echo "======================================"
echo "PrePost Standalone Deployment"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Warning: .env.local not found${NC}"
    echo "Creating from template..."
    cp .env.production.template .env.local
    echo -e "${RED}Please edit .env.local and add your ANTHROPIC_API_KEY${NC}"
    exit 1
fi

# Check if ANTHROPIC_API_KEY is set
if ! grep -q "ANTHROPIC_API_KEY=sk-ant-" .env.local; then
    echo -e "${RED}Error: ANTHROPIC_API_KEY not configured in .env.local${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Environment variables configured"

# Create necessary directories
echo "Creating directories..."
mkdir -p data
mkdir -p backups
mkdir -p logs
chmod 755 data backups logs
echo -e "${GREEN}✓${NC} Directories created"

# Install dependencies
echo "Installing dependencies..."
npm ci --production=false
echo -e "${GREEN}✓${NC} Dependencies installed"

# Run type check
echo "Running type check..."
npm run type-check || {
    echo -e "${YELLOW}Warning: Type check failed (continuing anyway)${NC}"
}

# Build the application
echo "Building application..."
npm run build
echo -e "${GREEN}✓${NC} Build completed"

# Create initial backup
echo "Creating initial backup..."
mkdir -p backups/initial-$(date +%Y%m%d-%H%M%S)
echo -e "${GREEN}✓${NC} Backup directory created"

# Test health endpoint
echo "Testing application..."
npm start &
APP_PID=$!
sleep 5

if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Health check passed"
    kill $APP_PID
else
    echo -e "${RED}✗${NC} Health check failed"
    kill $APP_PID
    exit 1
fi

echo ""
echo "======================================"
echo -e "${GREEN}Deployment Complete!${NC}"
echo "======================================"
echo ""
echo "To start the application:"
echo "  npm start"
echo ""
echo "Or with PM2:"
echo "  pm2 start npm --name prepost -- start"
echo ""
echo "Or with Docker:"
echo "  docker-compose up -d"
echo ""
echo "Health check:"
echo "  curl http://localhost:3000/api/health"
echo ""
