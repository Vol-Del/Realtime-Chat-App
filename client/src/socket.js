import { io } from 'socket.io-client';


let socket = null;
export function connect(token, onConnect) {
    socket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:4000', {
        auth: { token }
    });
    socket.on('connect', () => onConnect && onConnect());
    return socket;
}
export function getSocket() { return socket; }