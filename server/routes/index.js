// server/routes/index.js

import calendar from './calendar.js';
import docs from './docs.js';
import summarize from './summarize.js';

export const routes = {
  '/calendar': calendar,
  '/docs': docs,
  '/summarize': summarize,
};
