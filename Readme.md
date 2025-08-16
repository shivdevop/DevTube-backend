# DevTube Backend 🎬

A production-ready backend for DevTube, a developer-focused video-sharing platform inspired by YouTube. This backend is built with Node.js, Express, MongoDB, Mongoose, JWT authentication, and Cloudinary for media uploads.

## 🚀 Features
- User authentication (JWT, access & refresh tokens)
- Video upload & management
- Like/dislike system
- Comments system
- Posts (community updates)
- Playlists management
- Subscriptions
- Dashboard with analytics (views, likes, recent activity)

## 🛠️ Tech Stack
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Auth: JWT (Access + Refresh Tokens)
- Media: Cloudinary
- Validation: Zod / Joi (whichever you’ve added)
- Documentation: README (Swagger pending)

## 📂 Project Structure
src/
│── controllers/    # Route handlers
│── models/         # Mongoose models
│── routes/         # API routes
│── middlewares/    # Middleware (auth, validation, etc.)
│── utils/          # Helpers (cloudinary, asyncHandler, etc.)
│── validators/     # Request validation schemas
│── index.js        # Entry point

## ⚙️ Installation
```bash
git clone https://github.com/yourusername/devtube-backend.git
cd devtube-backend
npm install
npm run dev
```

## 🔑 Environment Variables
Create a .env file in root:
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/devtube
ACCESS_TOKEN_SECRET=youraccesstokensecret
REFRESH_TOKEN_SECRET=yourrefreshtokensecret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=yourcloudname
CLOUDINARY_API_KEY=yourapikey
CLOUDINARY_API_SECRET=yourapisecret

## 📡 API Endpoints
Auth & Users
POST   /api/v1/users/register        # Register new user
POST   /api/v1/users/login           # Login
POST   /api/v1/users/logout          # Logout
GET    /api/v1/users/me              # Get logged-in user profile
PUT    /api/v1/users/update-profile  # Update profile

Videos
POST   /api/v1/videos/               # Upload video
GET    /api/v1/videos/:id            # Get video details
PUT    /api/v1/videos/:id            # Update video
DELETE /api/v1/videos/:id            # Delete video
GET    /api/v1/videos/               # List all videos

Likes
POST   /api/v1/likes/toggle          # Like/Dislike a video
GET    /api/v1/likes/:videoId        # Get likes for video

Comments
POST   /api/v1/comments/:videoId     # Add comment
GET    /api/v1/comments/:videoId     # Get comments for video
DELETE /api/v1/comments/:id          # Delete comment

Posts
POST   /api/v1/posts/                # Create post
GET    /api/v1/posts/                # Get all posts
DELETE /api/v1/posts/:id             # Delete post

Playlists
POST   /api/v1/playlists/            # Create playlist
GET    /api/v1/playlists/:id         # Get playlist
PUT    /api/v1/playlists/:id         # Update playlist
DELETE /api/v1/playlists/:id         # Delete playlist

Subscriptions
POST   /api/v1/subscriptions/:id     # Subscribe to user
DELETE /api/v1/subscriptions/:id     # Unsubscribe
GET    /api/v1/subscriptions/me      # Get my subscriptions

Dashboard
GET    /api/v1/dashboard/analytics   # Get analytics (views, likes, subs)
GET    /api/v1/dashboard/activity    # Get recent activity

## 📬 Example API Call
Register User
POST /api/v1/users/register
Content-Type: application/json
{
  "username": "shivam",
  "email": "shivam@example.com",
  "password": "mypassword"
}

Response
{
  "success": true,
  "user": {
    "id": "64c1234567890",
    "username": "shivam",
    "email": "shivamexample.com"
  },
  "tokens": {
    "accessToken": "xxxx",
    "refreshToken": "xxxx"
  }
}

## 🛡️ Authentication
All protected routes require JWT token in header:
Authorization: Bearer <access_token>

## 📊 Future Work
Add Swagger docs (/api-docs)
Add unit & integration tests
CI/CD pipeline