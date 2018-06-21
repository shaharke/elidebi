class AuthError extends Error {
  constructor(message) {
      console.log('In error', message)
      super(message)
      Error.captureStackTrace(this, this.constructor)
  }
}

exports.AuthError = AuthError