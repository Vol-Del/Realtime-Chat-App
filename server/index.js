// server/index.js
import cors from "cors";
import http from "http";
import express from "express";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// For ES modules (__dirname replacement)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let SECRET;
SECRET = "dev-secret-please-change" || process.env.JWT_SECRET;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: true, credentials: true }
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// In-memory "DB"
const users = {}; // { username: { username, password } }
const rooms = { general: { name: "general", messages: [] } };

// Helpers
function sign(user) {
    return jwt.sign({ username: user.username }, SECRET, { expiresIn: "7d" });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET);
    } catch {
        return null;
    }
}

// ✅ Root route (fixes "Cannot GET /")
app.get("/", (req, res) => {
    res.send("🚀 Chat API is running! Use /api routes.");
});

// ---------------- AUTH ROUTES ----------------

// Register
app.post("/api/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ error: "username and password required" });
    if (users[username]) return res.status(400).json({ error: "user exists" });

    users[username] = { username, password };
    const token = sign({ username });
    res.json({ token, user: { username } });
});

// Login
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const u = users[username];
    if (!u || u.password !== password)
        return res.status(401).json({ error: "invalid credentials" });

    const token = sign({ username });
    res.json({ token, user: { username } });
});

// Get current user
app.get("/api/me", (req, res) => {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    const payload = token ? verifyToken(token) : null;
    if (!payload) return res.status(401).json({ error: "unauthenticated" });
    res.json({ user: { username: payload.username } });
});

// ---------------- ROOMS ----------------

// List rooms
app.get("/api/rooms", (req, res) => {
    res.json(Object.keys(rooms));
});

// Create room
app.post("/api/rooms", (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "name required" });
    if (rooms[name]) return res.status(400).json({ error: "room exists" });
    rooms[name] = { name, messages: [] };
    res.json({ ok: true, room: { name } });
});

// ---------------- SOCKET.IO ----------------

// Socket.IO auth middleware
io.use((socket, next) => {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    const payload = token ? verifyToken(token) : null;
    if (!payload) return next(new Error("unauthenticated"));
    socket.user = { username: payload.username };
    next();
});

// Socket.IO events
io.on("connection", (socket) => {
    const user = socket.user;
    console.log("connected", user.username);

    socket.join("general");
    socket.emit("rooms", Object.keys(rooms));

    socket.on("join", (roomName, cb) => {
        if (!rooms[roomName]) return cb && cb({ error: "no such room" });
        socket.join(roomName);
        const history = rooms[roomName].messages.slice(-100);
        cb && cb({ ok: true, messages: history });
    });

    socket.on("leave", (roomName) => {
        socket.leave(roomName);
    });

    socket.on("message", (data, cb) => {
        const { room, text } = data || {};
        if (!room || !text) return cb && cb({ error: "room and text required" });

        const msg = {
            id: Date.now() + Math.random().toString(36).slice(2, 9),
            room,
            text,
            user: user.username,
            ts: new Date().toISOString()
        };

        if (!rooms[room]) rooms[room] = { name: room, messages: [] };
        rooms[room].messages.push(msg);
        io.to(room).emit("message", msg);

        cb && cb({ ok: true });
    });

    socket.on("disconnect", () => {
        console.log("disconnected", user.username);
    });
});

let PORT;
PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`✅ Server listening on ${PORT}`));
