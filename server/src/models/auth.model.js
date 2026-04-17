import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const authSchema = new mongoose.Schema(

    {
        name: {
            type: String,
            required: [true, "User name is required"],
            trim: true,
            lowercase: true
        },

        email: {
            type: String,
            required: [true, "User email is required"],
            unique: [true, "User email should be unique"],
            trim: true,
            lowercase: true
        },

        password: {
            type: String,
            select: false
        },

        userRole: {
            type: String,
            enum: {
                values: ["user", 'admin'],
                message: `{VALUE} is not valid. Only user & admin are valid`
            },
            default: 'user',
            trim: true,
            lowercase: true
        },

        refreshTokenKey: {
            type: String,
            default: null
        },

        googleId: {
            type: String,
        },

        lastLogin: {
            type: String,
            enum: {
                values: ["email", 'google'],
                message: `{VALUE} is not valid. Only user & email are google`
            },
            default: 'email',
            trim: true,
            lowercase: true
        }
    },

    { timestamps: true }
)

authSchema.methods.accessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            userRole: this.userRole
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME }
    )
}

authSchema.methods.refreshToken = function () {
    return jwt.sign(
        {
            id: this._id,
            userRole: this.userRole
        },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY_TIME }
    )
}

authSchema.pre('save', async function () {
    if (!this.password || !this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
    return;
})

export const User = mongoose.models.User || mongoose.model("User", authSchema);