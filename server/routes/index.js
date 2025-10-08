import { Router } from "express";
import summarize from "./summarize.js";
import calendar from "./calendar.js";
import docs from "./docs.js";
import { requireAuth } from "../lib/auth.js";

const r = Router();
r.post("/summarize-url", requireAuth, summarize);
r.get("/calendar-daily", requireAuth, calendar);
r.get("/docs/search", requireAuth, docs);
export default r;
