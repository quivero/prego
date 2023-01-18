import startServer from "./server.js";
import env from "./env_info.js";

const port = parseInt(env.APP_PORT, 10) || 3000;
startServer(port);
