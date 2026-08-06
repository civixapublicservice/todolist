export const sendError = (res, statusCode, message, field = null) => {
  return res.status(statusCode).json({
    error: message,
    ...(field && { field }),
  })
}
