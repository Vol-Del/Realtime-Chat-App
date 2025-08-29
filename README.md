#Realtime Chat App (Socket.IO, React, Vite)

**A real-time chat application** built with React, Vite, and Socket.IO, featuring authentication, multiple rooms, message history, and a Frutiger Aero-inspired user interface.

## Features
- ### User Authentication
  - Register and login with username and password.
  - JWT-based authentication.

- ### Realtime Chat
  - Messages sent and received in real-time.
  - Users join specific chat rooms.
  - Message history (last 100 messages per room).

- ### Rooms
  - Create new chat rooms.
  - Switch between existing rooms.

- ### Logout
  - Securely log out and return to login screen.

- ### Stylish UI
  - Frutiger Aero inspired: gradients, glassy panels, rounded buttons.
  - Responsive and clean design.


### Technologies Used
- Frontend
- React 18
- Vite
- TailwindCSS
- Axios
- Socket.IO Client

### Backend
- Node.js
- Express
- Socket.IO
- JSON Web Token (JWT)
- Cors

## Installation
### 1. Clone the repository
`git clone https://github.com/yourusername/chat-app.git`
`cd chat-app`

### 2. Start the server
`cd server`
`npm install`
`node index.js`


The server will run on http://localhost:4000

### 3. Start the client
`cd client`
`npm install`
`npm run dev`


The client will run on http://localhost:5173
 (Vite default).

## Usage
1. Open the client in your browser: http://localhost:5173
2. Register a new account or log in.
3. Join the default general room or create a new room.
4. Send and receive messages in real-time.
5. Use the Logout button to exit securely.

## Notes

This project uses an in-memory database (for users and messages).
All data is lost when the server restarts. For production, connect a database like MongoDB or PostgreSQL.

JWT secret is set in the code (dev-secret-please-change) for development. Use environment variables in production.


Screenshots


License

MIT License © 2025 Volodymyr Artemenko
