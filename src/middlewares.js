import express from 'express';

import { morganMiddleware } from '../utils/logging/logger.js';

const parserConfig = { extended: true };

export const prewares = [
  express.json(parserConfig),
  express.urlencoded(parserConfig),
  morganMiddleware,
];

export const poswares = [
  express.json(parserConfig),
  express.urlencoded(parserConfig),
  morganMiddleware,
];
