import { text } from 'express';
import mongoose from 'mongoose';

// Define the schema for the Message model
// This schema includes fields for senderId, receiverId, text, and image
const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String
        },
        image: {
            type: String
        },
    },
    {
        timestamps: true
    }
);

// Create the Message model using the defined schema
const Message = mongoose.model('Message', messageSchema);
export default Message;
