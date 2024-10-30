import express from "express";
import { PORT } from "../config.js";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", routes);

app.listen(PORT, () => {
    console.log(`Server is up and running at port ${PORT}`);
});