import express, { type Express, type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import multer from "multer";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.use(
  (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "Uploaded file exceeds maximum size of 20MB." });
    }

    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message || "File upload failed." });
    }

    if (err instanceof Error) {
      if (err.message === "Only PDF files are accepted") {
        return res.status(400).json({ error: err.message });
      }
      return res.status(500).json({ error: err.message || "Internal server error" });
    }

    res.status(500).json({ error: "Internal server error" });
  },
);

export default app;
