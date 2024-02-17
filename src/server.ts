import app from "./app"
import mongoose from 'mongoose';
import {connect} from "./db/database"
import {MongoMemoryServer} from "mongodb-memory-server";
import dotenv from "dotenv";

dotenv.config();


const port = process.env.PORT || 3000;

connect().then(async (dbConnection: MongoMemoryServer) => {
    const db_url = dbConnection.getUri();
    await mongoose.connect(db_url);
    console.log("Connected to database at", dbConnection.getUri());

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });

}).catch((error) => {
    console.log("Error connecting to database", error);
});


// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    // app.exit();
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting Down...");
    console.log(err.name, err.message);
    process.exit(1);
});