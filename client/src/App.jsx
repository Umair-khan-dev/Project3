import { useState, useEffect } from "react";
import io from "socket.io-client";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import Login from "./pages/Login";

const socket = io("http://localhost:5000");

function App() {
  const [user, setUser] = useState(null);
  const [chatUser, setChatUser] = useState(null);

  useEffect(() => {
    if (user) {
      socket.emit("add_user", user.username);
    }
  }, [user]);

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <div className="h-screen flex bg-gray-900 text-white overflow-hidden">
      <Sidebar setChatUser={setChatUser} socket={socket} user={user} />
      <ChatWindow socket={socket} user={user} chatUser={chatUser} />
    </div>
  );
}

export default App;