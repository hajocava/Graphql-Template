import express from 'express';
import mongo from 'mongoose'
import { checkToken } from './middleware/auth'
import { server } from './apollo'
import './env' // Environment Variables

const app = express();

app.use(checkToken) // Middleware for validate tokens
server.applyMiddleware({ app })

const options = { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }

mongo.connect(process.env.URI, options).then(() => {
    // If connected, then start server
    app.listen(process.env.PORT, () => {
        console.log('Server on port', process.env.PORT);
        console.log('Mongo on port: ', process.env.DBPORT);
    });
}).catch(err => {
    console.log(err)
});