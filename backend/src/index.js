import express from "express"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import {connectDB} from "./lib/db.js";
import cors from "cors";
import {app, server} from "./lib/socket.js";
import path from "path";

dotenv.config()

const port = process.env.PORT;
const __dirname = path.resolve();

connectDB();
app.use(cors({
    origin: "http://localhost:5173", // Adjust this to your frontend URL
    credentials: true, // Allow cookies to be sent with requests
}));
app.use(express.json({limit: "50mb"})); // Increase the limit for larger payloads
app.use(express.urlencoded({extended: true, limit: "50mb"})); // Increase the
app.use(cookieParser());

// Error handling middleware for payload size errors
app.use((error, req, res, next) => {
    if (error.type === 'entity.too.large') {
        return res.status(413).json({
            error: 'Request payload too large',
            message: 'The request payload exceeds the maximum allowed size'
        });
    }
    next(error);
});

// Define your routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

server.listen(port, () => {
    console.log(`Server is running on ${port}`);
});