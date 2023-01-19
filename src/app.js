import express from "express";
import { prewares, poswares } from "./middlewares.js";
import base_router_tuples from "./routers/router_bundler.js";

let base_route_string, router;

const app = express();

prewares.forEach((preware) => app.use(preware));

base_router_tuples.forEach(
    (base_router_tuple) => {
        base_route_string = base_router_tuple[0];
        router = base_router_tuple[1];

        app.use(base_route_string, router)
    }
);

poswares.forEach((posware) => app.use(posware));

export default app;
