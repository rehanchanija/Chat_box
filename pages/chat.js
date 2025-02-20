import { useEffect, useState, useRef } from "react";
import socket from "../utils/socket";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current;
      messagesContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Load existing messages
    socket.on("loadMessages", (loadedMessages) => {
      setMessages(loadedMessages);
      setTimeout(scrollToBottom, 100); // Scroll after messages load
    });

    // Handle new messages
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      setTimeout(scrollToBottom, 100); // Scroll after new message
    });

    return () => {
      socket.off("loadMessages");
      socket.off("receiveMessage");
    };
  }, []);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim().length > 0) {
      setUsername(username.trim());
    }
  };

  const sendMessage = () => {
    if (text.trim()) {
      const messageData = {
        text: text,
        username: username,
        senderId: socket.id,
        time: new Date().toISOString()
      };
      socket.emit("sendMessage", messageData);
      setText("");
    }
  };

  if (!username) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-96 p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Enter Your Name</h2>
          <form onSubmit={handleUsernameSubmit}>
            <input
              className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
            />
            <button 
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white shadow-md p-4">
        <h2 className="text-xl font-semibold text-gray-800">Chat Room</h2>
        <p className="text-gray-600">Logged in as: {username}</p>
      </div>
      
      <div 
        ref={messagesContainerRef}
        className="flex-1 p-4 overflow-auto scroll-smooth"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg, index) => {
            const isMyMessage = msg.senderId === socket.id;
            
            return (
              <div 
                key={index} 
                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[70%] p-4 rounded-xl shadow-sm ${
                    isMyMessage 
                      ? 'bg-blue-500 text-white rounded-br-none' 
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <div className="font-medium text-sm mb-1">
                    {isMyMessage ? 'You' : msg.username}
                  </div>
                  <div className="break-words">{msg.text}</div>
                  <div className={`text-xs mt-1 ${isMyMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                    {msg.time ? new Date(msg.time).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : new Date().toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="bg-white p-4 shadow-md">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
          />
          <button 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;