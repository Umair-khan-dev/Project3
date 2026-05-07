import { useEffect, useState, useRef } from "react";
import MessageBubble from "./MessageBubble";
import axios from "axios";

export default function ChatWindow({ socket, user, chatUser }) {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [typing, setTyping] = useState("");
    const endRef = useRef();

    // Load chat history
    useEffect(() => {
        if (!chatUser || !user) return;

        axios.get(`http://localhost:5000/api/messages/${user.username}/${chatUser.username}`)
            .then(res => setChat(res.data))
            .catch(err => console.error("Error fetching messages:", err));
    }, [chatUser, user]);

    // Receive messages and typing status
    useEffect(() => {
        if (!socket) return;

        socket.on("receive_message", (data) => {
            if (data.sender === chatUser?.username) {
                setChat(prev => [...prev, data]);
            }
        });

        socket.on("typing", (msg) => {
            setTyping(msg);
            const timer = setTimeout(() => setTyping(""), 3000);
            return () => clearTimeout(timer);
        });

        return () => {
            socket.off("receive_message");
            socket.off("typing");
        };
    }, [socket, chatUser]);

    const sendMessage = () => {
        if (!message || !chatUser) return;

        const msgData = {
            sender: user.username,
            receiver: chatUser.username,
            message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        socket.emit("send_message", msgData);
        setChat(prev => [...prev, msgData]);
        setMessage("");
    };

    const handleTyping = () => {
        if (!chatUser) return;
        socket.emit("typing", {
            receiver: chatUser.username,
            msg: `${user.username} is typing...`
        });
    };

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    if (!chatUser) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#222e35] border-l border-gray-800">
                <div className="text-center max-w-md p-6">
                    <img 
                        src="https://static.whatsapp.net/rsrc.php/v3/y6/r/wa669ae5z23.png" 
                        alt="WhatsApp" 
                        className="w-64 mx-auto opacity-20 mb-8"
                    />
                    <h1 className="text-3xl font-light text-[#e9edef] mb-3">WhatsApp Web</h1>
                    <p className="text-[#8696a0] text-sm leading-relaxed">
                        Send and receive messages without keeping your phone online.<br/>
                        Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
                    </p>
                    <div className="mt-16 flex items-center justify-center gap-2 text-[#667781] text-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        End-to-end encrypted
                    </div>
                </div>
            </div>
        );
    }

    const getAvatar = (name) => `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;

    return (
        <div className="flex-1 flex flex-col h-screen bg-[#0b141a] border-l border-gray-800 relative overflow-hidden">
            {/* Background Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' }}></div>

            {/* Header */}
            <div className="p-3 bg-[#202c33] text-white flex items-center justify-between z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <img 
                        src={chatUser.profilePic || getAvatar(chatUser.username)} 
                        className="w-10 h-10 rounded-full object-cover" 
                        alt={chatUser.username}
                    />
                    <div>
                        <h3 className="font-semibold text-sm">{chatUser.username}</h3>
                        <p className="text-[11px] text-gray-400">online</p>
                    </div>
                </div>
                <div className="flex gap-5 text-gray-400 px-2">
                    <button className="hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                    <button className="hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:px-16 lg:px-24 space-y-1 z-10 scrollbar-hide">
                {chat.map((msg, i) => (
                    <MessageBubble key={i} msg={msg} own={msg.sender === user.username} />
                ))}
                <div ref={endRef}></div>
            </div>

            {/* Typing Indicator */}
            {typing && (
                <div className="absolute bottom-20 left-4 md:left-24 px-3 py-1 bg-[#202c33] rounded-lg text-xs text-gray-300 z-20 animate-fade-in shadow-lg">
                    {typing}
                </div>
            )}

            {/* Input Footer */}
            <div className="p-3 bg-[#202c33] flex gap-3 items-center z-10">
                <button className="text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
                <button className="text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                </button>
                <div className="flex-1 relative">
                    <input
                        className="w-full p-2.5 px-4 rounded-lg bg-[#2a3942] text-white outline-none placeholder:text-gray-500 text-sm"
                        placeholder="Type a message"
                        value={message}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            handleTyping();
                        }}
                    />
                </div>
                {message ? (
                    <button onClick={sendMessage} className="text-[#00a884] p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                ) : (
                    <button className="text-gray-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}