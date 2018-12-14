import '@babel/polyfill';
import Koa from 'koa2';
import http from 'http';
import { ApolloServer, gql } from 'apollo-server-koa';
import db from './db/index';
import logger from './util/logging';
import mongoose from './db/model/mongo/db';

logger.info(`Started server with PID ${process.pid}`);

// Retrieve environment values
const port = process.env.PORT || 3000;

// Connect to mongodb

mongoose
  .connect(
    `mongodb://mongodb/${process.env.NODE_ENV}`,
    {
      useNewUrlParser: true,
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASS,
      authSource: 'admin',
    },
  )
  .catch(() => {
    logger.error('Failed to connect to database');
    process.exit(-1);
  });

// Load schema and resolvers
let parsedSchema = '';
try {
  parsedSchema = gql`
    ${db.gqlSchema}
  `;
} catch (e) {
  logger.info(db.gqlSchema);
  process.exit(-1);
}

const server = new ApolloServer({
  typeDefs: parsedSchema,
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
