const errorResponse = (statusCode, status, errorMsg, res) => {
  res.status(statusCode).send({
    status: status,
    data: {
      error: errorMsg,
    },
  });
};

export default errorResponse;
