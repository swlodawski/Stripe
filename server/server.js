const express = require('express');
const { ApolloServer} = require('@apollo/server');
const {_expressMiddleware, expressMiddleware} = require('@apollo/server/express4');
const path = require('path');
const { authMiddleware} = require('./utils/auth');

const { typeDefs, resolvers} = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers
});

const startApolloServer = async () => {
    await server.start();

    app.use(express, express.urlencoded({ extended: false}));
    app.use(express.json);

    app.use('/images', express.static(path.join(__dirname, '../client/public/images')));

    app.use('/graphql', expressMiddleware(server, {
        context: authMiddleware
    }));

    if(process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../client/dist')));

        app.get('*', (req, res)=> {
            res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        });
    }

    db.once('open', () => {
        app.listen(PORT, () => {
            console.log(`API Server running on ${PORT}`)
            console.log(`Use graphQL at http://localhost/${PORT}/graphql`);
        });
    });
};

startApolloServer();