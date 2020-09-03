/* interface Ierror {
  errorCode: number,
  httpCode: number,
  message: string
} */

interface IerrorCodes {
  // [error: string] : Ierror
  [errorName: string] : {
    errorCode: number,
    httpCode: number,
    message: string
  }
}

// List of every error for proper responses
export const errorCodes : IerrorCodes = {
  INTERNAL_SERVER_ERROR: { errorCode: 1000, httpCode: 500, message: 'Internal server error, please try again later or contact the support' },
  NOT_FOUND: { errorCode: 1001, httpCode: 404, message: 'Resource not found' },
  WRONG_PARAMETERS: { errorCode: 1002, httpCode: 400, message: 'Wrong parameters, please check the request' },
  WEAK_PASSWORD: { errorCode: 1003, httpCode: 400, message: 'Weak Password. Must have a length between 8~128 and a minimum of 1 uppercase, lowercase, symbol and number' },
  LOGIN_FAILURE: { errorCode: 1004, httpCode: 401, message: 'Failed to login, please try again' },
  UNHAUTORIZED: { errorCode: 1005, httpCode: 401, message: 'Unhautorized, please authenticate' },
};
