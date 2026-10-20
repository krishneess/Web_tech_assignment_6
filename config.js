
require("dotenv").config();
const mongoose = require("mongoose");

let connectionPromise = null;

const connectDB = async () => {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
        throw new Error("MONGODB_URI is missing");
    }

    if (mongoose.connection.readyState === 1) {
        return mongoose;
    }

    if (!connectionPromise) {
        connectionPromise = mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000,
            maxPoolSize: 5
        }).catch((error) => {
            connectionPromise = null;
            throw error;
        });
    }

    return connectionPromise;
};

module.exports = connectDB;
