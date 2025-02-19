import { io } from "socket.io-client";
const socket = io("http://192.168.1.21:5000");

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

export default socket;
