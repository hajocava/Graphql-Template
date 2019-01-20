import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { schema } from '../graphql'
import { checkToken } from '../middleware/auth'
import mongoose from 'mongoose'
import './env' // Environment Variables

const app = express();
const server = new ApolloServer({ schema, context: ({req}) => ({ user: req.user }) })


app.use(checkToken) // Middleware for validate tokens
server.applyMiddleware({ app })

const options = { useNewUrlParser: true,useCreateIndex: true }

mongoose.connect(process.env.URI, options).then(() => {
    // If connected, then start server
    app.listen(process.env.PORT, () => {
        console.log('Server on port', process.env.PORT);
        console.log('Mongo on port: ', process.env.DBPORT);
    });
}).catch(err => {
    console.log(err)
});
