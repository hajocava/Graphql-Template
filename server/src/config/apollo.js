import { ApolloServer } from 'apollo-server-express'
import { schema } from '../graphql'
import { processUpload } from '../utils/upload'
import models from '../models';

export const server = new ApolloServer({
    schema,
    context({ req }) {
        return {
            models,
            user: {
                id: req.user,
                role: req.role
            },
            utils: {
                processUpload
            }
        }
    }
})