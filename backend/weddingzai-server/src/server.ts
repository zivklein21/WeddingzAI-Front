import express, { Application } from "express";
import cors from "cors";
import uploadRoutes from "./routes/upload-routes";

const app: Application = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const apiBase = "/api";

app.use("/api", uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
