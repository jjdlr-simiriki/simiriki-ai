import express from "express";
import helmet from "helmet";
import pino from "pino-http";
import { rl } from "./middleware/rateLimit";
import { enrich } from "./routes/enrich";

const app = express();

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(pino());

app.get("/health", (_req, res) => res.send("ok"));
app.use("/api/enrich", enrich);
app.post("/api/assist", rl, async (_req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

const port = process.env.PORT ? Number(process.env.PORT) : 8080;
if (require.main === module) {
  app.listen(port, () => console.log(`simiriki-ai listening on ${port}`));
}

export default app;
