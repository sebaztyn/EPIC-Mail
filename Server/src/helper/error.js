
const serverError = (request, response) => {
  response.status(500).json({
    status: 500,
    Error: "Something went wrong. Try again later"
  });
};

export default serverError;
