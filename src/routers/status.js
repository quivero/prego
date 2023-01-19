import { Router } from 'express';

import { statusPage_controller } from '../controllers/status.js';

let status_router = Router();

status_router.get(
    '/page/:animal/:code',
    statusPage_controller
);

export default status_router;
