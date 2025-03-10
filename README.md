# Jay Kirana Store

A full-stack e-commerce application for grocery store management.

## Project Structure

```
jay-kirana/
├── client/         # React frontend
└── server/         # Node.js backend
```

## Prerequisites

- Node.js 14+ and npm
- MongoDB Atlas account
- Gmail account for email notifications
- Vercel account for deployment

## Environment Variables

### Server (.env)

Create a `.env` file in the server directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_atlas_uri

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Email Configuration
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_specific_password

# Admin Configuration
ADMIN_EMAIL=your_admin_email

# Client URL
CLIENT_URL=https://your-frontend-domain.vercel.app

# Server URL (for production)
SERVER_URL=https://your-backend-domain.vercel.app
```

### Client (.env)

Create a `.env` file in the client directory:

```env
REACT_APP_API_URL=https://your-backend-domain.vercel.app
```

## Local Development Setup

### Server Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create necessary directories:
   ```bash
   mkdir uploads
   mkdir uploads/avatars
   mkdir uploads/marketing
   ```

4. Start the development server:
   ```bash
   npm run dev
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

3. Start the development server:
   ```bash
   npm start
   ```

## Deployment

### Backend Deployment (Vercel)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Create a `vercel.json` file in the server directory:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "index.js"
       }
     ]
   }
   ```

3. Configure environment variables in Vercel:
   - Go to your project settings in Vercel
   - Add all the environment variables from your `.env` file

4. Deploy the server:
   ```bash
   cd server
   vercel
   ```

### Frontend Deployment (Vercel)

1. Update the environment variables in the client's `.env` file with your production backend URL

2. Build the project:
   ```bash
   cd client
   npm run build
   ```

3. Deploy to Vercel:
   ```bash
   vercel
   ```

## File Storage in Production

For production, consider using cloud storage solutions like:
- AWS S3
- Cloudinary
- Firebase Storage

This is because Vercel's serverless functions are stateless and don't persist files.

## Important Notes

1. Make sure to update CORS settings with your production domain
2. Use environment variables for all configuration
3. Set up proper security headers
4. Enable proper MongoDB Atlas network access
5. Configure Gmail with App-Specific Password for email functionality

## Features

- User authentication and authorization
- Product management
- Order processing
- Email notifications
- Marketing email campaigns
- User profile management
- Admin dashboard
- Responsive design

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT
- Email: Nodemailer with Gmail
- File Upload: Multer
- Deployment: Vercel

## Support

For any issues or questions, please contact the development team.
