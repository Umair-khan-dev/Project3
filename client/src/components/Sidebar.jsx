import { useEffect, useState } from "react";
import axios from "axios";

export default function Sidebar({ setChatUser, socket, user }) {
    const [users, setUsers] = useState([]);
    const [online, setOnline] = useState([]);

    useEffect(() => {
        if (!user) return;
        axios.get("http://localhost:5000/api/users")
            .then(res => {
                const filteredUsers = res.data.filter(u => u.username !== user?.username);
                setUsers(filteredUsers);
            })
            .catch(err => console.error("Error fetching users:", err));
    }, [user]);

    useEffect(() => {
        if (!socket) return;

        socket.on("online_users", (data) => {
            setOnline(data);
        });

        return () => socket.off("online_users");
    }, [socket]);

    const isOnline = (username) => {
        return online.some(u => u.username === username);
    };

    const getAvatar = (name) => `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;

    return (
        <div className="w-1/4 bg-[#111b21] flex flex-col h-full border-r border-gray-800">
            {/* Header */}
            <div className="p-4 bg-[#202c33] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src={user?.profilePic || getAvatar(user?.username || "U")}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border border-gray-700"
                    />
                    <p className="text-white font-semibold">{user?.username || "Guest"}</p>
                </div>
                <div className="flex gap-4 text-gray-400">
                    <button className="hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </button>
                    <button className="hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="p-2 bg-[#111b21]">
                <div className="bg-[#202c33] flex items-center px-4 py-1.5 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                        type="text" 
                        placeholder="Search or start new chat" 
                        className="bg-transparent border-none outline-none text-white text-sm w-full px-3 py-1 placeholder:text-gray-500"
                    />
                </div>
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-y-auto">
                {users.length > 0 ? (
                    users.map(u => (
                        <div
                            key={u._id}
                            onClick={() => setChatUser(u)}
                            className="flex items-center gap-3 p-3 hover:bg-[#202c33] cursor-pointer border-b border-[#202c33]/50 transition-colors"
                        >
                            <div className="relative flex-shrink-0">
                                <img
                                    src={u.profilePic || getAvatar(u.username)}
                                    className="w-12 h-12 rounded-full object-cover"
                                    alt={u.username}
                                />
                                {isOnline(u.username) && (
                                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#111b21] rounded-full"></span>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <p className="text-white font-medium truncate">{u.username}</p>
                                    <span className="text-[10px] text-gray-500">12:45 PM</span>
                                </div>
                                <p className="text-gray-500 text-sm truncate">Tap to start chatting...</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-600 text-sm">
                        <p>No contacts yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}