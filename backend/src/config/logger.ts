import winston from 'winston';
import path from 'path';
import fs from 'fs';

const logDir = process.env.LOG_DIR || 'logs';

try {
  fs.mkdirSync(logDir, { recursive: true });
} catch (e) {
  console.warn('Could not create log directory:', logDir, e);
}

const transports: winston.transport[] = [
  new winston.transports.Console({
    level: 'debug',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  })
];

if (fs.existsSync(logDir)) {
  transports.push(
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') })
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports
});

export default logger;
