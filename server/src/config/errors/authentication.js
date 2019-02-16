import { createError } from 'apollo-errors'
import { baseResolver } from './baseResolver'

export const ForbiddenError = createError('ForbiddenError', {
    message: 'You do not have permission to perform this action.'
});

export const AuthenticationRequiredError = createError('AuthenticationRequiredError', {
    message: 'You must log in to do this'
});

export const isAuth = baseResolver.createResolver(
    // Extract the user from the context (undefined if it does not exist)
    (root, args, { user: { id } }, info) => {
        if (!id) throw new AuthenticationRequiredError()
        
    }
);

export const isAdmin = isAuth.createResolver(
    // Extract the user and make sure he is an administrator.
    (root, args, { user: { role } }, info) => {
        if (role !== 'ADMIN') throw new ForbiddenError()
    }
)