import mongoose from "mongoose";

const DBConnect = async () => {
    try {

        const newConnection = await mongoose.connect(process.env.DB_URL);
        console.log("DB connected:", newConnection.connection.host);
        return;

    } catch (error) {
        console.log("DB connection failed:", error.message);
        throw error;
    }
}

export default DBConnect;