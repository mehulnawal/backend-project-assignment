const checkValidation = (schema, source = "body") => (req, res, next) => {

    const result = schema.safeParse(req[source]);

    if (!result.success) {
        const message = result.error.issues.map(e => e.message).join(', ');

        const error = new Error(message);
        error.status = 400;

        return next(error);
    }

    req.body = result.data;
    next();
}

export default checkValidation;