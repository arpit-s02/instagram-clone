const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = status === 500 ? "Something went wrong" : err.message;

  console.error(err);

  return res.status(status).json({ message });
};

export default errorHandler;
