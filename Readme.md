# DevTube Backend

A scalable backend for a YouTube-like platform, built with Node.js, Express, and MongoDB. Features include user authentication, video uploads, playlists, posts, comments, likes, and subscriptions.

## 🚀 API Documentation
You can explore the full API documentation and test endpoints directly in Postman:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/15270926/2sB3BHm9VV)

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
- `POST /api/v1/users/logout` — Logout
- `POST /api/v1/users/change-password` — Change password
- `GET /api/v1/users/current-user` — Get current user
- `PUT /api/v1/users/update-account-details` — Update account details
- `PUT /api/v1/users/update-avatar` — Update avatar
- `PUT /api/v1/users/refresh-access-token` — Refresh access token
- `GET /api/v1/users/get-user-channel/:username` — Get user channel


### Video
- `POST /api/v1/videos/upload-video` — Upload video
- `GET /api/v1/videos/` — Get videos feed
- `GET /api/v1/videos/:videoid` — Get video by id
- `DELETE /api/v1/videos/:videoid` — Delete video
- `PATCH /api/v1/videos/:videoid` — Update video

### Playlist
- `POST /api/v1/playlists/newPlaylist` — Create a new playlist
- `GET /api/v1/playlists/userPlaylists/:userId` — Get all playlists of a user
- `GET /api/v1/playlists/:playlistId` — Get playlist by ID
- `POST /api/v1/playlists/:playlistId/addVideo/:videoId` — Add a video to playlist
- `DELETE /api/v1/playlists/:playlistId/removeVideo/:videoId` — Remove a video from playlist
- `PATCH /api/v1/playlists/update/:playlistId` — Update playlist details
- `DELETE /api/v1/playlists/delete/:playlistId` — Delete a playlist
- `PUT /api/v1/playlists/togglePrivacy/:playlistId` — Toggle privacy (public/private) of playlist

### Post
- `POST /api/v1/posts/create` — Create post
- `DELETE /api/v1/posts/delete/:postid` — Delete post
- `GET /api/v1/posts/channel/:channelid` — Channel posts

### Comment
- `POST /api/v1/comments/post` — Create comment
- `POST /api/v1/comments/post` — Create reply to a comment
- `DELETE /api/v1/comments/delete/:commentid` — Delete comment
- `GET /api/v1/comments?targetType=Video|Post|Comment&targetId=...` — Get comments for a Post/Video/Comment
- `GET /api/v1/comments/replies/:commentId` — Get replies

### Like
- `POST /api/v1/likes/toggle-like` — Toggle like for a video, post, or comment
- `GET /api/v1/likes/video/:videoid` — Get likes for a video
- `GET /api/v1/likes/comment/:commentid` — Get likes for a comment 

### Subscription
- `POST /api/v1/subscriptions/:channelid` — Subscribe
- `DELETE /api/v1/subscriptions/:channelid` — Unsubscribe
- `GET /api/v1/subscriptions/count/:channelid` — Subscriber count for a channel 
- `GET /api/v1/subscriptions/mySubscriptions` — My subscriptions

### Dashboard
- `GET /api/v1/dashboard/` — Get dashboard data


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
