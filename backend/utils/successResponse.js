const successResponse = (statusCode, status, data, res) => {
  res.status(statusCode).send({
    status: status,
    data,
  });
};

export default successResponse;
