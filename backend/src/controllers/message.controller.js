import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io} from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    //we want to get all users except ourself
    try {
        const loggedInUser = req.user._id; // Assuming req.user is populated by the protectRoute middleware
        const users = await User.find({ _id: { $ne: loggedInUser } }).select("-password"); // Exclude password field
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users for sidebar:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const userId = req.params.id; // Get the user ID from the request parameters
        const myId = req.user._id; // Assuming req.user is populated by the protectRoute middleware

        // Find messages where either sender or receiver is the logged-in user and the other is the specified user
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userId },
                { senderId: userId, receiverId: myId }
            ]
        }).sort({ createdAt: 1 }); // Sort messages by creation time

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const userId = req.params.id; // Get the user ID from the request parameters
        const myId = req.user._id; // Assuming req.user is populated by the protectRoute middleware
        const { text, image } = req.body; // Extract text and image from request body
         // Debug logging
        console.log("Request body:", { text, image: image ? "Image data received" : "No image" });

        let imageUrl;
        if(image){
            //Upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        else{
            imageUrl = undefined; // If no image is provided, set it to undefined
        }
        // Create a new message instance
        // If image is not provided, it will be undefined
        const newMessage = new Message({
            senderId: myId,
            receiverId: userId,
            text,
            image: imageUrl // Use the uploaded image URL or undefined
        });

        // Save the message to the database
        await newMessage.save();

        // Emit the new message to the receiver's socket
        const receiverSocketId = getReceiverSocketId(userId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}