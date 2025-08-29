const SERVER = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';


export async function register(username, password) {
    const res = await fetch(`${SERVER}/api/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password })
    });
    return res.json();
}
export async function login(username, password) {
    const res = await fetch(`${SERVER}/api/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password })
    });
    return res.json();
}
export async function me(token) {
    const res = await fetch(`${SERVER}/api/me`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
}
export async function listRooms() {
    const res = await fetch(`${SERVER}/api/rooms`);
    return res.json();
}
export async function createRoom(name) {
    const res = await fetch(`${SERVER}/api/rooms`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
    return res.json();
}