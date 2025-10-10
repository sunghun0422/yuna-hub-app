import express from "express";
import calendar from "./calendar.js";
import summarize from "./summarize.js";
import docs from "./docs.js";

const router = express.Router();

router.get("/calendar-daily", calendar);
router.post("/summarize", summarize);
router.get("/docs", docs);

export default router;
