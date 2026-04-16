import { User } from "../models/auth.model.js";
import ApiError from "../utils/apiError.js";
import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
    try {
        const { accessToken } = req.cookies;

        if (!accessToken) {
            return next(new ApiError(401, "Access token missing"));
        }

        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);

        const user = await User.findById(decodedToken.id).select("-password");

        if (!user) {
            return next(new ApiError(404, "User not found"));
        }

        req.user = user;
        next();

    } catch (error) {
        return next(new ApiError(401, error?.message || "Invalid Access Token"));
    }
}
