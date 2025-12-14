# TaskSphere

A production-ready full-stack task management platform built with React, Node.js, Express, and MongoDB. TaskSphere allows users to create, manage, and organize their tasks with a clean, modern interface.

## 🚀 Features

- **User Authentication**
  - Email/Password registration and login
  - Google OAuth 2.0 integration
  - JWT-based authentication
  - Protected routes

- **Task Management**
  - Create, read, update, and delete tasks
  - Task status tracking (Pending, In Progress, Completed)
  - Task descriptions
  - User-specific task isolation

- **Modern UI/UX**
  - Responsive design
  - Clean and intuitive interface
  - Real-time task updates
  - Modal-based task creation/editing

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite) - Modern React with fast HMR
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with modern design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Passport.js** - Google OAuth authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
TaskSphere/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   └── taskController.js     # Task CRUD operations
│   ├── middlewares/
│   │   ├── authMiddleware.js     # JWT verification
│   │   └── errorMiddleware.js    # Error handling
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Task.js               # Task schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   └── taskRoutes.js         # Task endpoints
│   ├── server.js                 # Express app entry point
│   ├── .env.example              # Environment variables template
│   ├── .gitignore
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── ProtectedRoute.jsx    # Route protection
    │   ├── pages/
    │   │   ├── Login.jsx             # Login page
    │   │   ├── Register.jsx          # Registration page
    │   │   ├── Dashboard.jsx         # Task dashboard
    │   │   ├── Auth.css              # Auth page styles
    │   │   └── Dashboard.css         # Dashboard styles
    │   ├── services/
    │   │   ├── api.js                # Axios configuration
    │   │   └── auth.js               # Auth utilities
    │   ├── App.jsx                   # Main app component
    │   ├── main.jsx                  # Entry point
    │   └── index.css                 # Global styles
    ├── index.html
    ├── vite.config.js
    ├── .env.example
    ├── .gitignore
    └── package.json
```

## 🏗️ Architecture

### Backend Architecture (MVC Pattern)

- **Models**: Define database schemas using Mongoose
- **Controllers**: Handle business logic and request/response
- **Routes**: Define API endpoints (no business logic)
- **Middlewares**: Authentication and error handling
- **Config**: Database and external service configurations

### Frontend Architecture

- **Pages**: Main page components (Login, Register, Dashboard)
- **Components**: Reusable UI components
- **Services**: API calls and authentication utilities
- **Protected Routes**: Route guards for authenticated users

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Google Cloud Console** account (for OAuth setup)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd TaskSphere
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env file with your configuration
nano .env  # or use your preferred editor
```

**Backend Environment Variables:**

```env
PORT=5000
NODE_ENV=development
MONGODB_URL=mongodb://localhost:27017/tasksphere_db
JWT_SECRET_KEY=your_strong_jwt_secret_key_here
JWT_EXPIRES_IN=1d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env file with your configuration
nano .env  # or use your preferred editor
```

**Frontend Environment Variables:**

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Set **Authorized redirect URIs**:
   - `http://localhost:5000/api/auth/google/callback` (for development)
7. Copy **Client ID** and **Client Secret** to your `.env` files

### 5. Start MongoDB

**Local MongoDB:**
```bash
# Start MongoDB service
sudo systemctl start mongod  # Linux
# or
brew services start mongodb-community  # macOS
```

**MongoDB Atlas:**
- Use your MongoDB Atlas connection string in `MONGODB_URL`

### 6. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev  # Development mode with nodemon
# or
npm start    # Production mode
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/google` | Initiate Google OAuth | Public |
| GET | `/api/auth/google/callback` | Google OAuth callback | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Tasks

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/tasks` | Get all user tasks | Private |
| POST | `/api/tasks` | Create new task | Private |
| PUT | `/api/tasks/:id` | Update task | Private |
| DELETE | `/api/tasks/:id` | Delete task | Private |

### Request/Response Examples

**Register User:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Create Task:**
```json
POST /api/tasks
Headers: { "Authorization": "Bearer <token>" }
{
  "title": "Complete project",
  "description": "Finish the TaskSphere project",
  "status": "in-progress"
}
```

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Protected Routes**: Middleware-based route protection
- **Input Validation**: Server-side validation
- **CORS**: Configured for secure cross-origin requests
- **Environment Variables**: Sensitive data stored in .env

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Gradient**: Beautiful color schemes
- **Task Cards**: Clean card-based task display
- **Status Badges**: Visual status indicators
- **Modal Dialogs**: Smooth task creation/editing
- **Error Handling**: User-friendly error messages

## 🧪 Testing the Application

1. **Register a new account** or **Login** with existing credentials
2. **Use Google Login** to test OAuth integration
3. **Create tasks** with different statuses
4. **Edit tasks** to update details
5. **Delete tasks** to remove them
6. **Logout** and verify protected routes redirect to login

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod --version`
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### Google OAuth Not Working
- Verify redirect URI matches exactly
- Check Client ID and Secret in `.env`
- Ensure Google+ API is enabled

### CORS Errors
- Verify `CLIENT_URL` in backend `.env` matches frontend URL
- Check backend CORS configuration

### JWT Token Issues
- Verify `JWT_SECRET_KEY` is set and strong
- Check token expiration settings
- Clear localStorage and re-login

## 📝 Development Notes

- **Backend**: Uses strict MVC architecture - no business logic in routes
- **Frontend**: Component-based architecture with service layer
- **Error Handling**: Centralized error middleware in backend
- **Code Quality**: Clean, readable, and maintainable code structure

## 🚀 Deployment

### Backend Deployment (Example: Heroku)

1. Set environment variables in Heroku dashboard
2. Ensure MongoDB Atlas connection string is set
3. Update `CLIENT_URL` to production frontend URL
4. Deploy: `git push heroku main`

### Frontend Deployment (Example: Vercel/Netlify)

1. Set environment variables in deployment platform
2. Update `VITE_BACKEND_URL` to production backend URL
3. Build: `npm run build`
4. Deploy the `dist` folder

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ for production-ready task management.

---

**Happy Task Managing! 🎉**

