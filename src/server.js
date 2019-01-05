import '@babel/polyfill';
import Koa from 'koa2';
import { ApolloServer, gql } from 'apollo-server-koa';
import db from './db/index';
import logger from './util/logging';
import mongoose from './db/model/mongo/db';

logger.info(`Started server with PID ${process.pid}`);

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
  logger.error(db.gqlSchema);
  logger.error(e);
  process.exit(-1);
}

/** Start server */
// Configuration values
const port = process.env.PORT || 3000;
const host = process.env.host || '0.0.0.0';

const server = new ApolloServer({
  typeDefs: parsedSchema,
  resolvers: db.resolvers,
  subscriptions: '/subscriptions',
});

// Create Koa2 app
const app = new Koa();
server.applyMiddleware({ app });

const httpServer = app.listen(port, host, () => {
  logger.info(`🚀 GraphQL server ready at http://localhost:${port}${server.graphqlPath}`);
});

server.installSubscriptionHandlers(httpServer);

logger.info(`🚀 Subscriptions server ready at http://localhost:${port}${server.subscriptionsPath}`);

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
