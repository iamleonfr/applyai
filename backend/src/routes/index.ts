import { Router, type IRouter } from "express";
import healthRouter from "./health";
import analyzeRouter from "./analyze";
import downloadPdfRouter from "./download-pdf";

const router: IRouter = Router();

router.use(healthRouter);
router.use(analyzeRouter);
router.use(downloadPdfRouter);

export default router;
