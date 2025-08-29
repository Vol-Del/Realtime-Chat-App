import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const API_URL = "http://localhost:4000/api";

export default function Chat({ user, setUser }) {
    const [socket, setSocket] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState("general");
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const s = io("http://localhost:4000", { auth: { token } });

        s.on("connect", () => console.log("connected"));
        s.on("rooms", (rooms) => setRooms(rooms));
        s.on("message", (msg) => {
            if (msg.room === currentRoom) {
                setMessages((prev) => [...prev, msg]);
            }
        });

        setSocket(s);
        return () => s.disconnect();
    }, [currentRoom]);

    useEffect(() => {
        if (!socket) return;
        socket.emit("join", currentRoom, (res) => {
            if (res.ok) setMessages(res.messages);
        });
    }, [socket, currentRoom]);

    function sendMessage() {
        if (!text.trim()) return;
        socket.emit("message", { room: currentRoom, text }, (res) => {
            if (res.ok) setText("");
        });
    }

    async function createRoom() {
        const name = prompt("Room name?");
        if (!name) return;
        await axios.post(`${API_URL}/rooms`, { name });
        setRooms((prev) => [...prev, name]);
        setCurrentRoom(name);
    }

    function handleLogout() {
        localStorage.removeItem("token"); // remove JWT
        if (setUser) setUser(null);       // reset user state in App.jsx
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-sky-300 via-cyan-200 to-emerald-200">
            {/* Sidebar */}
            <div className="w-64 bg-white/60 backdrop-blur-md shadow-lg rounded-r-3xl p-4 flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-bold text-cyan-700 mb-4">Rooms</h2>
                    <div className="space-y-2">
                        {rooms.map((r) => (
                            <button
                                key={r}
                                onClick={() => setCurrentRoom(r)}
                                className={`w-full text-left px-4 py-2 rounded-xl transition ${
                                    r === currentRoom
                                        ? "bg-gradient-to-r from-sky-400 to-emerald-300 text-white shadow-md"
                                        : "bg-white/70 hover:bg-cyan-100 text-cyan-700"
                                }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={createRoom}
                        className="mt-4 w-full py-2 rounded-xl bg-gradient-to-r from-green-400 to-cyan-400 text-white shadow-lg hover:scale-105 transition"
                    >
                        + Room
                    </button>
                </div>

                {/* Logout button */}
                <button
                    onClick={handleLogout}
                    className="mt-4 w-full py-2 rounded-xl bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg hover:scale-105 transition"
                >
                    Logout
                </button>
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col p-6">
                <h2 className="text-2xl font-bold text-sky-800 mb-4 drop-shadow">
                    Room: {currentRoom}
                </h2>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto bg-white/50 rounded-2xl shadow-inner p-4 space-y-2 backdrop-blur-md">
                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={`p-3 rounded-2xl max-w-lg ${
                                m.user === user.username
                                    ? "ml-auto bg-gradient-to-r from-sky-400 to-cyan-300 text-white shadow-md"
                                    : "bg-white/80 text-sky-900 shadow"
                            }`}
                        >
              <span className="block text-sm font-semibold">
                {m.user === user.username ? "You" : m.user}
              </span>
                            <span>{m.text}</span>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="mt-4 flex space-x-2">
                    <input
                        className="flex-1 p-3 rounded-xl bg-white/70 backdrop-blur-md border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type a message..."
                    />
                    <button
                        onClick={sendMessage}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-400 text-white font-semibold shadow-lg hover:scale-105 transition"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
