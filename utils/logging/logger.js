import {
  createLogger,
  format,
  transports,
  config,
} from 'winston';

export const logger = createLogger({
  level: 'debug',
  levels: config.npm.levels,
  format: format.combine(
    format.padLevels(),
    format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
    format.colorize(),
    format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
  ),
  transports: [new transports.Console()],
  exceptionHandlers: [
    new transports.Console({
      format: format.errors(),
    }),
  ],
  rejectionHandlers: [new transports.Console()],
});
