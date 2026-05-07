require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const msgRoutes = require("./routes/messages");
const User = require("./models/User");
const Message = require("./models/Message");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", msgRoutes);

// Get all users
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find({}, "username _id");
        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: "Error fetching users" });
    }
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/chatapp")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Connection Error:", err));

let onlineUsers = [];

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("add_user", (username) => {
        // Remove if user already exists in online list (e.g. from previous connection)
        onlineUsers = onlineUsers.filter(u => u.username !== username);
        onlineUsers.push({ username, socketId: socket.id });
        io.emit("online_users", onlineUsers);
        console.log(`${username} is online`);
    });

    socket.on("send_message", async (data) => {
        // Save to DB
        try {
            const newMsg = new Message({
                sender: data.sender,
                receiver: data.receiver,
                message: data.message,
                time: data.time || new Date().toLocaleTimeString()
            });
            await newMsg.save();

            const receiver = onlineUsers.find(u => u.username === data.receiver);
            if (receiver) {
                io.to(receiver.socketId).emit("receive_message", data);
            }
        } catch (err) {
            console.error("Error saving message:", err);
        }
    });

    socket.on("typing", (data) => {
        const receiver = onlineUsers.find(u => u.username === data.receiver);
        if (receiver) {
            io.to(receiver.socketId).emit("typing", data.msg);
        }
    });

    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter(u => u.socketId !== socket.id);
        io.emit("online_users", onlineUsers);
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});