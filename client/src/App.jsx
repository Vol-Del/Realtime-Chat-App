import React, { useState, useEffect } from "react";
import axios from "axios";
import Chat from "./components/Chat";
import Login from "./components/Login";

const API_URL = "http://localhost:4000/api";

export default function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        axios
            .get(`${API_URL}/me`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setUser(res.data.user))
            .catch(() => localStorage.removeItem("token"));
    }, []);

    if (!user) {
        return <Login setUser={setUser} />;
    }

    return <Chat user={user} />;
}
