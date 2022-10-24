import express from 'express';

import {
  logging,
  morganMiddleware,
  agentMorganReporter,
  log_message
} from '../utils/logging/logger.js';

import {
  statusMW,
  statusImgPath
} from '../utils/logging/status.js'; 

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export const app = express();

app.use(require('express-status-monitor')());

app.use(statusMW);

// [START enable_parser]
// This middleware is available in Express v4.16.0 onwards
app.use(express.json({ extended: true }));
// [END enable_parser]

// [START enable_parser]
// This middleware is available in Express v4.16.0 onwards
app.use(express.json({ extended: true }));
// [END enable_parser]

// [START logger]
app.use(morganMiddleware);
// [END logger]

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  log_message(agentMorganReporter, 'info', `Listening on port: ${PORT}`);
});