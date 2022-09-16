
//error handler middleware
const notFound = (err,req,res,next) => {

  const error = new Error(`NOT FOUND - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

//error handler middleware
const errorHandler = (err,req,res,next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode)
  return res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  })
}

export {notFound, errorHandler}



