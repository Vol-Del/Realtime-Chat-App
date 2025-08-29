import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/api";

export default function Login({ setUser }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleAuth(path) {
        try {
            const res = await axios.post(`${API_URL}/${path}`, { username, password });
            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong");
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-sky-200 via-cyan-300 to-emerald-200">
            <div className="bg-white/50 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-96 flex flex-col space-y-6">
                <h2 className="text-3xl font-bold text-sky-800 text-center drop-shadow-md">
                    Welcome
                </h2>

                {error && (
                    <p className="text-red-600 font-semibold text-center">{error}</p>
                )}

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-3 rounded-xl bg-white/70 backdrop-blur-md border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-3 rounded-xl bg-white/70 backdrop-blur-md border border-cyan-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />

                <div className="flex justify-between space-x-4">
                    <button
                        onClick={() => handleAuth("login")}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-emerald-400 text-white font-semibold shadow-lg hover:scale-105 transition"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => handleAuth("register")}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 text-white font-semibold shadow-lg hover:scale-105 transition"
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}
