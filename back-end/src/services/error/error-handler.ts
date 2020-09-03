import type { ErrorRequestHandler } from 'express'; // eslint-disable-line no-unused-vars
import ErrorResponse from './structure/error-response';
import * as stackTrace from './stack-trace';
import * as winston from '../log/winston';

const errorsFileLogger = winston.loggers.get('errorsFileLogger');
const errorsConsoleLogger = winston.loggers.get('errorsConsoleLogger');

const errorHandler : ErrorRequestHandler = (err, req, res, next) : void => {
  const lastTrace = stackTrace.lastErrorTrace(err);
  const trace = {
    file: lastTrace?.getFileName() ?? '?',
    function: lastTrace?.getFunctionName() ?? '?',
    position: {
      line: lastTrace?.getLineNumber() ?? '?',
      column: lastTrace?.getColumnNumber() ?? '?',
    },
  };

  const errorResponse = ErrorResponse.parse(err);

  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const message = `
    Error: [${errorResponse.error.errorCode}] from client [${clientIp}].
    Result: [${JSON.stringify(errorResponse.result)}].
    Position [row,col] = [${trace.position.line},${trace.position.column}] from file [${trace.file}].
    Function: [${trace.function}]`;
  if (process.env.NODE_ENV !== 'production') {
    const consoleMessage = message;
    errorsConsoleLogger.error(consoleMessage);
  } else if (process.env.LOGGING === 'true') {
    const logMessage = message.replace(/(\r\n|\n|\r)/gm, '');
    errorsFileLogger.error(logMessage);
  }

  res.status(errorResponse.error.httpCode as unknown as number).json({
    Status: false,
    Error: errorResponse.error.errorCode,
    Message: errorResponse.error.message,
  });
};

export default errorHandler;

process.on('unhandledRejection', (err : { name:string, message: string } /* , promise */) => {
  let recomendationMessage = 'Try to restart the server';
  if (err.name === 'SequelizeAccessDeniedError' || err.name === 'SequelizeConnectionError') {
    recomendationMessage = 'Verify mysql credentials and run \'npm run migrate\' to setup the database before starting the server';
  }
  const consoleMessage = `\n Error: [${err}]. \n Recomendation: [${recomendationMessage}]. \n`;
  errorsConsoleLogger.error(consoleMessage);

  process.exit(1);
});
