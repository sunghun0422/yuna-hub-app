import express from "express";
import calendarRoute from "./calendar.js";

const router = express.Router();

// ✅ 실제 API 경로 등록
router.use("/calendar-daily", calendarRoute);

export default router;
