import { useEffect, useState } from "react";
import socket from "../utils/socket";

 const  Chat=()=> {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
        console.log("New message:", message);
        setMessages((prev) => [...prev, message]); // Update state
    });

    // socket.on("receiveMessage", (message) => {
    //   setMessages((prev) => [...prev, message]);
    // });

    return ()  => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (text.trim()) {
    //   const message = { text, sender: "User" };
      socket.emit("sendMessage", text);
      setText("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-1/2 border p-4 rounded-lg">
        <div className="h-80 overflow-auto">
          {messages.map((msg, index) => (
            <p key={index} className="p-2 bg-gray-200 my-2 rounded">{msg}</p>
          ))}
        </div>
        <div className="flex mt-2">
          <input className="flex-1 border p-2" value={text} onChange={(e) => setText(e.target.value)} />
          <button className="bg-blue-500 text-white p-2" onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
export default Chat;