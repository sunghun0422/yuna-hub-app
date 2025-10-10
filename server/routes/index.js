import { Router } from "express";
import summarize from "./summarize.js";
import calendar from "./calendar.js";

const router = Router();

router.get("/calendar-daily", calendar);
router.post("/summarize", summarize);

export default router;
