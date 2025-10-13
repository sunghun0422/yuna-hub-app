import memoryRoute from "./routes/memory.js";
import storybookRoute from "./routes/storybook.js";
import gmailRoute from "./routes/gmail.js";
import calendarRoute from "./routes/calendar.js";

app.use("/api", memoryRoute);
app.use("/api", storybookRoute);
app.use("/api", gmailRoute);
app.use("/api", calendarRoute);
