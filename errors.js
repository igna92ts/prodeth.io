exports.badRequest = message => {
  return {
    statusCode: 400,
    message
  };
};
