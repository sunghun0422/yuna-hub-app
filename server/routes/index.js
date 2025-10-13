import express from "express";
import summarizeRouter from "./summarize.js";
import memoryRouter from "./Memory.js";
import storybookRouter from "./Storybook.js";
import gmailRouter from "./gmail.js";
import calendarRouter from "./calendar.js";

const router = express.Router();

router.use("/summarize-url", summarizeRouter);
router.use("/memory", memoryRouter);
router.use("/storybook", storybookRouter);
router.use("/gmail", gmailRouter);
router.use("/calendar", calendarRouter);

export default router;
