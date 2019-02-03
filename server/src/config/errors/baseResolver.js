import { createResolver } from 'apollo-resolvers';
import { createError, isInstance } from 'apollo-errors';

const UnknownError = createError('UnknownError', {
    message: '¡Un error desconocido a ocurrido! Por favor, inténtelo de nuevo más tarde'
});

export const baseResolver = createResolver(
    null,
    (root, args, context, error) => isInstance(error) ? error : new UnknownError()
);