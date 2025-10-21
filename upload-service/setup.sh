#!/bin/bash

# Kairoo Upload Service Setup Script for Oracle VPS
# Run this script on your Oracle VPS to set up everything automatically

set -e

echo "🚀 Kairoo Upload Service Setup"
echo "================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}Please do not run as root${NC}"
   exit 1
fi

# Step 1: Create uploads directory
echo -e "\n${YELLOW}Step 1: Creating uploads directory...${NC}"
sudo mkdir -p /var/www/KairooStorageFiles
sudo chown -R $USER:$USER /var/www/KairooStorageFiles
sudo chmod -R 755 /var/www/KairooStorageFiles
echo -e "${GREEN}✓ Uploads directory created${NC}"

# Step 2: Install dependencies
echo -e "\n${YELLOW}Step 2: Installing Node.js dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Step 3: Setup environment file
echo -e "\n${YELLOW}Step 3: Setting up environment file...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${YELLOW}Please edit .env file with your configuration:${NC}"
    echo "  - DATABASE_URL"
    echo "  - PUBLIC_URL"
    read -p "Press enter to edit .env file..."
    nano .env
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# Step 4: Create logs directory
echo -e "\n${YELLOW}Step 4: Creating logs directory...${NC}"
mkdir -p logs
echo -e "${GREEN}✓ Logs directory created${NC}"

# Step 5: Test database connection
echo -e "\n${YELLOW}Step 5: Testing database connection...${NC}"
source .env
if psql "$DATABASE_URL" -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Database connection successful${NC}"
else
    echo -e "${RED}✗ Database connection failed${NC}"
    echo "Please check your DATABASE_URL in .env"
    exit 1
fi

# Step 6: Start service with PM2
echo -e "\n${YELLOW}Step 6: Starting service with PM2...${NC}"
pm2 start ecosystem.config.cjs
pm2 save
echo -e "${GREEN}✓ Service started${NC}"

# Step 7: Setup Nginx
echo -e "\n${YELLOW}Step 7: Setting up Nginx...${NC}"
read -p "Do you want to setup Nginx? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo cp nginx.conf /etc/nginx/sites-available/uploads.kairoo.me
    sudo ln -sf /etc/nginx/sites-available/uploads.kairoo.me /etc/nginx/sites-enabled/
    sudo nginx -t && sudo systemctl reload nginx
    echo -e "${GREEN}✓ Nginx configured${NC}"
fi

# Step 8: Setup SSL
echo -e "\n${YELLOW}Step 8: Setting up SSL...${NC}"
read -p "Do you want to setup SSL with Certbot? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter your domain (e.g., uploads.kairoo.me): " domain
    sudo certbot --nginx -d $domain
    echo -e "${GREEN}✓ SSL configured${NC}"
fi

# Step 9: Setup PM2 startup
echo -e "\n${YELLOW}Step 9: Setting up PM2 to start on boot...${NC}"
pm2 startup
echo -e "${YELLOW}Please run the command above if shown${NC}"

# Final checks
echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}✓ Setup complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Service status:"
pm2 status
echo ""
echo "Test the service:"
echo "  curl http://localhost:4000/health"
echo ""
echo "View logs:"
echo "  pm2 logs kairoo-upload-service"
echo ""
echo "Manage service:"
echo "  pm2 restart kairoo-upload-service"
echo "  pm2 stop kairoo-upload-service"
echo "  pm2 monit"
