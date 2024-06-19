import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import comicsRouter from "./routes/comics";
import charactersRouter from "./routes/characters";

const app = express();
app.use(cors());
app.use(express.json());
app.use(comicsRouter);
app.use(charactersRouter);

app.all("*", (_req, res) => {
  res.status(404).json({ message: "This route does not exist" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
