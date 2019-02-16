import { createResolver } from 'apollo-resolvers'
import { createError, isInstance } from 'apollo-errors'

const UnknownError = createError('UnknownError', {
    message: 'An unknown error has occurred! Please try again later'
});

export const baseResolver = createResolver(
    null,
    (root, args, context, error) => isInstance(error) ? error : new UnknownError()
);