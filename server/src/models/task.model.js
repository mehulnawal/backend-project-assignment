import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true
        },

        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },

    { timestamps: true }
)

taskSchema.index({ createdAt: 1 });

export const Task = mongoose.model("Task", taskSchema);