import "@babel/polyfill";
import Koa from 'koa2';
import http from 'http';
import { ApolloServer, gql } from 'apollo-server-koa';
import db from './db/index';
import logger from './util/logging';

logger.info(`Started server with PID ${process.pid}`);

// Retrieve environment values
const port = process.env.PORT || 3000;

// Load schema and resolvers
const server = new ApolloServer({
  typeDefs: gql`
    ${db.gqlSchema}
  `,
  resolvers: db.resolvers,
});

// Create Koa2 app
const app = new Koa();
server.applyMiddleware({ app });

// Create http server
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// Handle signals
const exitOnSignal = (signal) => {
  logger.info(`Server with PID ${process.pid} received '${signal}'!`);
  logger.info('⏻ Shutting server down...');
  httpServer.close();
  process.exit();
};

try {
  process.on('exit', () => exitOnSignal('exit'));
  process.on('SIGTERM', () => exitOnSignal('SIGTERM'));
} catch (e) {
  logger.warn(`Failed to setup signal handlers: "${e}"`);
}

// Start listening
app.listen(port, () => {
  logger.info(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
  logger.info(`🚀 Subscriptions ready at ws://localhost:${port}${server.graphqlPath}`);
});
