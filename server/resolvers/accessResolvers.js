const { createError } = require('apollo-errors');

const { baseResolver } = require('./baseResolver');

const ForbiddenError = createError('ForbiddenError', {
  message: 'You are not allowed to do this',
});

const AuthenticationRequiredError = createError('AuthenticationRequiredError', {
  message: 'You must be logged in to do this',
});

const isAuthenticatedResolver = baseResolver.createResolver(
  // Extract the user from context (undefined if non-existent)
  (root, args, { user }, info) => {
    if (!user) throw new AuthenticationRequiredError();
  }
);

const isAdminResolver = isAuthenticatedResolver.createResolver(
  // Extract the user and make sure they are an admin
  (root, args, { user }, info) => {
    /*
      If thrown, this error will bubble up to baseResolver's
      error callback (if present).  If unhandled, the error is returned to
      the client within the `errors` array in the response.
    */
    if (!user.isAdmin) throw new ForbiddenError();

    /*
      Since we aren't returning anything from the
      request resolver, the request will continue on
      to the next child resolver or the response will
      return undefined if no child exists.
    */
  }
);

module.exports = { isAuthenticatedResolver, isAdminResolver };
