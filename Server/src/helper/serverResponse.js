
export const serverError = (response, err) => response.status(500).json({
  status: 500,
  Error: err.message
});
export const serverResponse = (response, statusValue, ...values) => {
  const [statusKey, dataKey, dataValue] = values;
  return response.status(statusValue).json({
    [statusKey]: statusValue,
    [dataKey]: dataValue
  });
};
export const authResponse = (response, statusValue, ...values) => {
  const [dataKey, dataValue] = values;
  return response.status(statusValue).json({
    [dataKey]: dataValue
  });
};
export const userResponse = (response, statusValue, userData) => response.status(statusValue).json({
    status: 201,
    data: userData
  });

