import { User } from '../models/auth.model.js';
import ApiError from '../utils/apiError.js';
import { idValidator } from '../validators/id.validtor.js';

export const generateToken = async (userId) => {
    try {

        const { success, error } = idValidator.safeParse({ id: userId.toString() });

        if (!success) {
            throw new Error('User id is invalid');
        }

        const user = await User.findById(userId);

        if (!user)
            throw new ApiError(404, 'User not found');

        const accessToken = await user.accessToken();
        const refreshToken = await user.refreshToken();

        user.refreshTokenKey = refreshToken;
        user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new Error(error.message);
    }
}