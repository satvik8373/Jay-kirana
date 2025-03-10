# Jay Kirana Store

A full-stack e-commerce application for grocery store management.

## Project Structure

```
jay-kirana/
├── client/         # React frontend
└── server/         # Node.js backend
```

## Prerequisites

- Node.js 14.x or higher
- MongoDB Atlas account
- Gmail account (for email notifications)
- Vercel account (for deployment)

## Installation & Setup

### Server Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```env
# MongoDB Connection
MONGODB_URI=your_mongodb_atlas_uri

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Email Configuration
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
EMAIL_SERVICE=gmail

# Admin Configuration
ADMIN_EMAIL=your_admin_email

# Client URL (After deployment)
CLIENT_URL=https://your-vercel-app-name.vercel.app

# Server URL (After deployment)
SERVER_URL=https://your-vercel-api-url.vercel.app
```

### Client Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```env
VITE_API_URL=https://your-vercel-api-url.vercel.app
```

## Development

### Running locally

1. Start the server:
```bash
cd server
npm run dev
```

2. Start the client:
```bash
cd client
npm run dev
```

## Deployment

### Deploying to Vercel

1. Server Deployment:
   - Create a new project on Vercel
   - Connect your GitHub repository
   - Set the following environment variables in Vercel:
     - All variables from server's `.env` file
   - Set the build command: `npm install && npm run build`
   - Set the output directory: `dist`
   - Deploy

2. Client Deployment:
   - Create a new project on Vercel
   - Connect your GitHub repository
   - Set the environment variables:
     - `VITE_API_URL`: Your Vercel API URL
   - Set the build command: `npm install && npm run build`
   - Set the output directory: `dist`
   - Deploy

## Features

- User authentication and authorization
- Product management
- Order processing
- Category management
- Marketing email campaigns
- Profile management with avatar upload
- Responsive design

## Security Notes

1. Never commit `.env` files to version control
2. Use strong JWT secrets
3. Enable 2FA on your Gmail account
4. Use environment variables for sensitive data
5. Keep dependencies updated

## Support

For support, email satvikpatel8373@gmail.com
