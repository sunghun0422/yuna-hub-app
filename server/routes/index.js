import { Router } from "express";
import summarize from "./summarize.js";
import docs from "./docs.js";
import calendar from "./calendar.js";

const r = Router();

r.post("/summarize-url", summarize);
r.get("/docs/search", docs);
r.get("/calendar-daily", calendar);

export default r;
