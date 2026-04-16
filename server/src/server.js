import app from "../app.js";
import DBConnect from "./database/db.js";

const PORT = process.env.PORT || 8000

const startServer = async () => {
    try {

        await DBConnect();

        app.listen(PORT, () => {
            console.log(`Server running on port - ${PORT}`);
        });

    } catch (error) {
        console.log("Failed to start server:", error.message);
        process.exit(1);
    }
}

startServer();