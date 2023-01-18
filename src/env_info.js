import * as dotenv from "dotenv";

const ENV_PATH = process.cwd() + "/" + ".env";

const env = dotenv.config(ENV_PATH).parsed;

export default env;
