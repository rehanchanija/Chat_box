import { io } from 'socket.io-client';

// Use environment variable or default to localhost
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  cors: {
    origin: "*"
  }
});

// Log connection status
socket.on('connect', () => {
  console.log('Connected to server with ID:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

export default socket;