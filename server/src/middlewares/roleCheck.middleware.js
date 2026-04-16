import ApiError from "../utils/apiError.js";

export const roleBaseAuth = async (...allowedRoles) => (req, res, next) => {

    const user = req.user;

    if (!user || !allowedRoles.includes(user.userRole))
        return next(new ApiError(403, "Access denied: Unauthorized role"));

    req.user = user;
    next();
}