# Jay Kirana - Online Grocery Store

A modern e-commerce platform for grocery shopping built with React.js and Node.js.

## Features

- User authentication and authorization
- Admin dashboard for product management
- Shopping cart functionality
- Order management
- Responsive design
- Real-time product search
- Category-based product filtering

## Tech Stack

- Frontend: React.js
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT
- Styling: CSS-in-JS
- Icons: React Icons
- State Management: Context API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:
```bash
git clone https://github.com/satvik-8373/jay-kirana.git
cd jay-kirana
```

2. Install dependencies:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Create environment variables:
Create a `.env` file in the server directory with:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the development servers:
```bash
# Start backend server
cd server
npm run dev

# Start frontend server (in a new terminal)
cd client
npm start
```

The application will be available at `http://localhost:3000`

## Deployment

The application can be deployed on any hosting platform of your choice. The frontend and backend should be deployed separately.

For development:
1. Frontend runs on `http://localhost:5173` or `http://localhost:3000`
2. Backend runs on `http://localhost:5000`

For production:
1. Deploy the frontend to your preferred static hosting service
2. Deploy the backend to your preferred Node.js hosting service
3. Update the CORS configuration in `server/index.js` with your production URLs

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/) # Jay-Kirana
