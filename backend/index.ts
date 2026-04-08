import "dotenv/config";
import app from "./src/app";
import { logger } from "./src/lib/logger";

// Railway sets PORT automatically, default to 3000 for local dev
const rawPort = process.env.PORT || "3000";

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, () => {
  logger.info({ port }, "Server listening");
});
