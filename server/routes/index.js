import express from "express";
import summarize from "./summarize.js";
import memory from "./Memory.js";
import storybook from "./Storybook.js";
import gmail from "./gmail.js";
import calendar from "./calendar.js"; // ✅ 캘린더 추가

const router = express.Router();

router.use("/summarize", summarize);
router.use("/memory", memory);
router.use("/storybook", storybook);
router.use("/gmail", gmail);
router.use("/calendar", calendar); // ✅ 추가 완료

export default router;
