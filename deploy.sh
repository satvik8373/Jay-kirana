#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Starting deployment process...${NC}"

# Stage all changes
echo -e "${GREEN}Staging changes...${NC}"
git add .

# Prompt for commit message
echo -e "${BLUE}Enter commit message:${NC}"
read commit_message

# Commit changes
echo -e "${GREEN}Committing changes...${NC}"
git commit -m "$commit_message"

# Push to GitHub
echo -e "${GREEN}Pushing to GitHub...${NC}"
git push origin main

echo -e "${BLUE}Deployment process completed!${NC}"
echo -e "${GREEN}Your changes will be automatically deployed by Vercel.${NC}"
echo -e "${GREEN}Check your deployment status at: https://vercel.com/dashboard${NC}" 