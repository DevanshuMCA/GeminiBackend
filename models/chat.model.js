import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Project",
        },
        messages: [
            {
                sender: { type: String, required: true },
                text: { type: String, required: true },
                timestamp: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
