import express from "express";
import { prewares, poswares } from "./middlewares.js";
import routers from "./routers.js";

const app = express();

prewares.forEach((preware) => app.use(preware));
routers.forEach((router) => app.use(router));
poswares.forEach((posware) => app.use(posware));

export default app;
