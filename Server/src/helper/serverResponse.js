
export const serverError = response => response.status(500).json({
  status: 500,
  Error: "Something went wrong. Try again later"
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
export const userResponse = (response, token, statusValue, ...values) => {
  const [statusKey, dataKey, dataValue] = values;
  return response.header('x-authorization', token).status(statusValue).json({
    [statusKey]: statusValue,
    [dataKey]: dataValue
  });
};
