import log4js from 'log4js';

// logging configurations
log4js.configure({
  appenders: { console: { type: 'console' } },
  categories: { default: { appenders: ['console'], level: 'info' } },
});

// global application logger instance
export const Logger = log4js.getLogger('console');
