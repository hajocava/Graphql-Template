import { ApolloServer } from 'apollo-server-express'
import { PubSub } from 'graphql-subscriptions'
import { schema } from '../graphql'
import { processUpload } from '../utils/upload'
import models from '../models'

export const pubsub = new PubSub()

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
    },
    playground: {
        endpoint: '/graphql',
        settings: {
            'editor.theme': 'light'
        },
        subscriptionEndpoint: 'ws://localhost:4000/subscriptions'
    }

})
