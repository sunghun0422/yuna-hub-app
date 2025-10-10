import { Router } from "express";
import calendar from "./calendar.js";
import summarize from "./summarize.js";

const router = Router();

router.get("/calendar-daily", calendar);
router.post("/summarize", summarize);

export default router;
