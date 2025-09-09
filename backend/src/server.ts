import express from "express";
import cors from "cors";
import tasksRouter from "./routes/tasks.js";        
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/error.js";

const app = express();


app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.use("/api/tasks", tasksRouter);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
