export const getCacheKey = (user) => {
    if (user.userRole == 'admin')
        return "tasks:all"

    return `tasks:user:${user._id}`;
}