import express from "express";
import { PORT } from "../config.js";
import cors from "cors";
import routes from "./routes/index.js";
import errorHandler from "./utils/errorHandler.js";
import connectDB from "./db/index.js";
import notFoundHandler from "./utils/notFoundHandler.js";

const app = express();

await connectDB();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/v1", routes);

// 404 handler for unknown routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Starting the server
app.listen(PORT, () => {
    console.log(`Server is up and running at port ${PORT}`);
});