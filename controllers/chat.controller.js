import Chat from "../models/chat.model.js";

/**
 * Create or update chat by projectId
 */
export const createChat = async (req, res) => {
    try {
        const { projectId, message } = req.body;
        if (!message || !projectId) {
            return res.status(400).json({ error: "Project ID and message are required" });
        }

        const newMessage = {
            sender: req.user.email, // Assuming `authUser` sets `req.user.email`
            text: message,
            timestamp: new Date(),
        };

        const chat = await Chat.findOneAndUpdate(
            { projectId },
            { $push: { messages: newMessage } }, // Append new message
            { new: true, upsert: true } // Create chat if it doesn't exist
        );

        return res.status(200).json({ message: "Message added", chat });
    } catch (error) {
        console.error("Error creating chat:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Get chat messages by projectId
 */
export const getChat = async (req, res) => {
    try {
        const { projectId } = req.params;
        if (!projectId) {
            return res.status(400).json({ error: "Project ID is required" });
        }

        const chat = await Chat.findOne({ projectId });
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        return res.status(200).json(chat);
    } catch (error) {
        console.error("Error fetching chat:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
