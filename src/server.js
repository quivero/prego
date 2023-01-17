// [START app]
import app from "./app.js";
import { log } from "../utils/logging/logger.js";

const startServer = (port) => {
  // Listen to the App Engine-specified port, or 8080 otherwise
  const fail_msg = `😿 Failed to listen on PORT ${port}`;
  const succ_msg = `😸 Application server listening on PORT ${port}`;

  const error_callback = (err) => (err ? log('error', fail_msg) : log('info', succ_msg));

  app.listen(port, error_callback);
};

export default startServer;

// [END app]
