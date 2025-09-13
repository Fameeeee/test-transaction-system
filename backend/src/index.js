import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config as loadEnv } from "dotenv";
import authRouter from "./routes/auth.js";
import bankingRouter from "./routes/banking.js";

loadEnv();

const app = express();

app.use(helmet());
app.use(cors({ origin: "*", credentials: false }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/banking", bankingRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
