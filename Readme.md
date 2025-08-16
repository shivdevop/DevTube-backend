# DevTube Backend

A scalable backend for a YouTube-like platform, built with Node.js, Express, and MongoDB. Features include user authentication, video uploads, playlists, posts, comments, likes, and subscriptions.

## Features
- User registration, login, and profile management
- Video upload, retrieval, update, and deletion
- Playlist creation, management, privacy toggling
- Posts with image support
- Comments and replies
- Like/unlike for videos, posts, and comments
- Channel subscriptions

## Tech Stack
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- Multer (file uploads)
- Cloudinary (media storage)

## Project Structure
```
src/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── validators/
├── app.js
├── index.js
```

## Installation
1. Clone the repository:
   ```bash 
   git clone https://github.com/yourusername/devtube-backend.git
   cd devtube-backend
   ```
2. Install dependencies:
   ```bash 
   npm install
   ```
3. Set up your `.env` file (see below).
   ```
   PORT=8000
   MONGO_URI=your_mongodb_connection_string
   CORS_ORIGIN=*
   ACCESS_TOKEN_SECRET=use yours
   ACCESS_TOKEN_EXPIRY=use yours
   REFRESH_TOKEN_SECRET=use yours
   REFRESH_TOKEN_EXPIRY=use yours
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
 
   

4. Start the server:
   ```bash
   npm run dev
   ```


## API Endpoints
### User
- `POST /api/v1/users/register` — Register
- `POST /api/v1/users/login` — Login
- `GET /api/v1/users/profile/:userid` — Get profile
- `PUT /api/v1/users/profile/update` — Update profile
- `POST /api/v1/users/avatar` — Upload avatar

### Video
- `POST /api/v1/videos/upload` — Upload video
- `GET /api/v1/videos/:videoid` — Get video details
- `GET /api/v1/videos/channel/:channelid` — Channel videos
- `DELETE /api/v1/videos/:videoid` — Delete video
- `PUT /api/v1/videos/:videoid` — Update video

### Playlist
- `POST /api/v1/playlists/create` — Create playlist
- `GET /api/v1/playlists/user/:userId` — User playlists
- `GET /api/v1/playlists/:playlistId` — Playlist by ID
- `POST /api/v1/playlists/:playlistId/add/:videoId` — Add video
- `DELETE /api/v1/playlists/:playlistId/remove/:videoId` — Remove video
- `PUT /api/v1/playlists/:playlistId` — Update playlist
- `DELETE /api/v1/playlists/:playlistId` — Delete playlist
- `GET /api/v1/playlists/public` — Public playlists
- `PATCH /api/v1/playlists/:playlistId/toggle-privacy` — Toggle privacy

### Post
- `POST /api/v1/posts/create` — Create post
- `DELETE /api/v1/posts/delete/:postid` — Delete post
- `GET /api/v1/posts/channel/:channelid` — Channel posts

### Comment
- `POST /api/v1/comments/post` — Create comment
- `DELETE /api/v1/comments/delete/:commentid` — Delete comment
- `GET /api/v1/comments?targetType=Video|Post|Comment&targetId=...` — Get comments
- `GET /api/v1/comments/replies/:commentId` — Get replies

### Like
- `POST /api/v1/likes/toggle-like` — Like/unlike
- `GET /api/v1/likes/video/:videoid` — Video likes
- `GET /api/v1/likes/comment/:commentid` — Comment likes
- `GET /api/v1/likes/post/:postid` — Post likes

### Subscription
- `POST /api/v1/subscriptions/:channelid` — Subscribe
- `DELETE /api/v1/subscriptions/:channelid` — Unsubscribe
- `GET /api/v1/subscriptions/count/:channelid` — Subscriber count
- `GET /api/v1/subscriptions/mySubscriptions` — My subscriptions

## Example API Calls
```bash
# Register a user
curl -X POST http://localhost:8000/api/v1/users/register -F "fullname=John Doe" -F "username=johndoe" -F "email=john@example.com" -F "password=yourpassword" -F "avatar=@/path/to/avatar.jpg"

# Upload a video
curl -X POST http://localhost:8000/api/v1/videos/upload -H "Authorization: Bearer <token>" -F "title=My Video" -F "videoFile=@/path/to/video.mp4"
```

## Authentication
Most endpoints require JWT authentication. Pass the token in the `Authorization` header:
```
Authorization: Bearer <your_token>
```

## Future Work
- Add unit & integration tests
- Improve error handling
- Add more analytics endpoints
- Enhance documentation

---

For questions or contributions, feel free to open an issue or pull request.
