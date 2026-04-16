import mongoose from "mongoose";
import apiResponse from "../config/apiResponse.config.js";
import { generateToken } from "../config/tokenGenerated.config.js";
import { User } from "../models/auth.model.js";
import ApiError from "../utils/apiError.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { googleClient } from "../config/googleAuth.js";

export const registerUser = async (req, res, next) => {

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {

        const { email, password, name } = req.body;

        const isUser = await User.findOne({ email }).session(session);

        if (isUser) {
            await session.abortTransaction();
            throw new ApiError(400, "User already present");
        }

        const newUser = new User({
            email,
            password,
            name
        })
        await newUser.save({ session });
        await session.commitTransaction();
        const { accessToken, refreshToken } = await generateToken(newUser._id);

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production'
        }

        res.cookie("accessToken", accessToken, cookieOptions);
        res.cookie("refreshToken", refreshToken, cookieOptions);

        return res.status(201).json(apiResponse({ status: 201, message: "User created successfully", data: newUser }));

    } catch (error) {
        await session.abortTransaction();
        next(error);
        return;
    }
    finally {
        session.endSession();
    }
}

export const emailLoginUser = async (req, res, next) => {
    try {

        const { email, password } = req.body;

        const userExists = await User.findOne({ email }).select("+password");

        if (!userExists)
            throw new ApiError(404, "User does not exists");

        const isPasswordCorrect = await bcrypt.compare(password, userExists.password);

        if (!isPasswordCorrect)
            throw new ApiError(401, "Invalid user credentials ");

        const { accessToken, refreshToken } = await generateToken(userExists._id);

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production'
        }

        res.cookie("accessToken", accessToken, cookieOptions);
        res.cookie("refreshToken", refreshToken, cookieOptions);

        return res.status(200).json(apiResponse({ status: 200, message: "User logged in successfully", data: userExists }));

    } catch (error) {
        next(error);
        return;
    }
}

export const googleLoginUser = async (req, res, next) => {
    try {

        const { token } = req.body;

        if (!token)
            return next(new ApiError(400, "Token is required"));

        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload();

        const { email, name, sub: googleId } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                googleId,
                password: null,
                lastLogin: "google"
            });
        } else {
            user.googleId = googleId;
            user.lastLogin = "google";
            await user.save();
        }

        const { accessToken, refreshToken } = await generateToken(user._id);

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production'
        }

        res.cookie("accessToken", accessToken, cookieOptions);
        res.cookie("refreshToken", refreshToken, cookieOptions);

        return res.status(200).json(apiResponse({ status: 200, message: "User logged in successfully", data: user }));

    } catch (error) {
        next(error);
    }
}

export const resetRefreshToken = async (req, res, next) => {
    try {

        const refreshTokenCookie = req.cookies.refreshToken;

        const isValid = await jwt.verify(refreshTokenCookie, process.env.REFRESH_TOKEN_SECRET_KEY);

        if (!isValid)
            throw new ApiError(401, "Refresh token is not valid");

        const user = await User.findById(isValid.id);

        if (!user)
            throw new ApiError(404, "User not found");

        const { accessToken, refreshToken } = await generateToken(user._id);

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production'
        }

        res.cookie("accessToken", accessToken, cookieOptions);
        res.cookie("refreshToken", refreshToken, cookieOptions);

        return res.status(201).json(apiResponse({
            status: 201, message: "Tokens reset", data: {
                refreshToken,
                accessToken
            }
        }));

    } catch (error) {
        next(error);
        return;
    }
}

export const logout = async (req, res, next) => {
    try {

        const user = await User.findByIdAndUpdate(req.user.id, { refreshTokenKey: '' }, { new: true });

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.status(200).json(apiResponse({
            status: 200, message: "Logout successfully", data: user
        }));

    } catch (error) {
        next(error);
    }
}