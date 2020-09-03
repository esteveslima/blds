import asyncHandler from './async-handler';

export const wrapAsyncFunctions = (asyncFunctions: object) : void => {
  const asyncFunctionsObject : object = asyncFunctions;
  Object.keys(asyncFunctionsObject).forEach((functionName) => {
    asyncFunctionsObject[functionName] = asyncHandler(asyncFunctions[functionName]);
  });
};
