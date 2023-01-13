import * as winston from "winston";
import logger from "morgan";

const { createLogger, format, transports, config } = winston;

const { label } = format;

/*
  We may define our own logging level. The default are given below
  by property config.syslog.levels
  const my_levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
  };
*/

/**
 * @abstract Log to defined transports
 *
 * @param {String} label_msg
 */
export const logging = (label_msg = "default") => {
  const logger_setup = {
    format: format.combine(
      label({ label: label_msg }),
      format.timestamp({ format: "DD/MM/YYYY HH:mm:ss.sss A" }),
      format.colorize(),
      format.printf(
        (info) =>
          `[${info.timestamp} - ${label_msg}] ${info.level}: ${info.message}`
      )
    ),
    transports: [new transports.Console()],
    exceptionHandlers: [
      new transports.Console({
        format: format.errors(),
      }),
    ],
    rejectionHandlers: [new transports.Console()],
  };

  const logger_ = createLogger(logger_setup);

  return logger_;
};

export const log_message = (logger, level, message) => {
  logger.log({
    level,
    message,
  });
};

export const agentMorganReporter = logging("morgan");

/**
 * @abstract Morgan middleware to log app access
 *
 */
export const morganMiddleware = logger(
  ":method :url :status :res[content-length] - :response-time ms",
  {
    stream: {
      // Configure Morgan to use our custom logger with the http severity
      write: (message) => agentMorganReporter.log("info", message),
    },
  }
);

/**
 * @abstract log message through transport using agentMorganReporter logger
 *
 */
export const log = (level, message) =>
  log_message(agentMorganReporter, level, message);
