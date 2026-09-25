import pino from 'pino';
import { config } from './config';

const NODE_ENV = config.NODE_ENV
export const logger = pino({
  level: NODE_ENV === 'production' ? 'info' : 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
})