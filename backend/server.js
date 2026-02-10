const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const industryMentorRoutes = require("./routes/industryMentorRoutes");
const collegeMentorRoutes = require("./routes/collegeMentorRoutes");
const psychologistRoutes = require("./routes/psychologistRoutes");
const messageRoutes = require("./routes/messageRoutes");
const careerSimulationRoutes = require("./routes/careerSimulationRoutes");
const wellnessRoutes = require("./routes/wellnessRoutes");
const skillAssessmentRoutes = require("./routes/skillAssessmentRoutes");
const ollamaRoutes = require("./routes/ollamaRoutes");
const path = require("path");

const socketIo = require("socket.io");
const Message = require("./models/Message");

// Initialize database connection
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/student", studentRoutes);
app.use("/industryMentor", industryMentorRoutes);
app.use("/collegeMentor", collegeMentorRoutes);
app.use("/psychologist", psychologistRoutes);
app.use("/messages", messageRoutes);
app.use("/careerSimulation", careerSimulationRoutes);
app.use("/wellness", wellnessRoutes);
app.use("/skillAssessment", skillAssessmentRoutes);
app.use("/ollama", ollamaRoutes);

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Store chatroom users
const chatroomUsers = new Map();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Existing 1-on-1 chat
  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("sendMessage", (data) => {
    const { receiver } = data;
    io.to(receiver).emit("receiveMessage", data);
  });

  // Student Chatroom
  socket.on("join-chatroom", ({ userId, userName, room }) => {
    socket.join(room);
    socket.userId = userId;
    socket.userName = userName;
    socket.room = room;

    chatroomUsers.set(socket.id, { userId, userName, room });

    // Broadcast online users to room
    const roomUsers = Array.from(chatroomUsers.values()).filter(u => u.room === room);
    io.to(room).emit("online-users", roomUsers);

    console.log(`${userName} joined chatroom: ${room}`);
  });

  socket.on("chatroom-message", (message) => {
    io.to(message.room).emit("chatroom-message", message);
  });

  // Video Call Events
  socket.on("join-video-call", ({ userId, userName, room }) => {
    socket.to(room).emit("user-joined-video", { userId, userName });
  });

  socket.on("video-offer", ({ to, offer, room }) => {
    io.to(room).emit("video-offer", { from: socket.userId, offer });
  });

  socket.on("video-answer", ({ to, answer, room }) => {
    io.to(room).emit("video-answer", { from: socket.userId, answer });
  });

  socket.on("ice-candidate", ({ to, candidate, room }) => {
    io.to(room).emit("ice-candidate", { from: socket.userId, candidate });
  });

  socket.on("leave-video-call", ({ userId, room }) => {
    socket.to(room).emit("user-left-video", { userId });
  });

  socket.on("disconnect", () => {
    chatroomUsers.delete(socket.id);
    if (socket.room) {
      const roomUsers = Array.from(chatroomUsers.values()).filter(u => u.room === socket.room);
      io.to(socket.room).emit("online-users", roomUsers);
      socket.to(socket.room).emit("user-left-video", { userId: socket.userId });
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

module.exports = { server, io };

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`💻 Socket.io server listening`);
});
