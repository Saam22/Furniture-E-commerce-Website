export function success(res, data = null, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function paginated(res, data, pagination) {
  return res.status(200).json({
    success: true,
    data,
    pagination,
  });
}

export function created(res, data = null, message = 'Created successfully') {
  return success(res, data, message, 201);
}

export function noContent(res) {
  return res.status(204).send();
}
