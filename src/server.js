import '@babel/polyfill';
import Koa from 'koa2';
import jwt from 'jsonwebtoken';
import { ApolloServer, gql } from 'apollo-server-koa';
import cors from '@koa/cors';
import db from './db/index';
import logger from './util/logging';
import mongoose from './db/model/mongo/db';

logger.info(`Started server with PID ${process.pid}`);

// Connect to mongodb
mongoose
  .connect(`mongodb://mongodb/${process.env.NODE_ENV}`, {
    useNewUrlParser: true,
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    authSource: 'admin',
  })
  .catch(() => {
    logger.error('Failed to connect to database');
    process.exit(-1);
  });

// Load schema and resolvers
let parsedSchema = '';
try {
  if (!db.gqlSchema.trim()) {
    logger.error('No schema is present');
    process.exit();
  }
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
const SECRET = process.env.SECRET || 'SECRET';

const server = new ApolloServer({
  typeDefs: parsedSchema,
  resolvers: db.resolvers,
  subscriptions: {
    onConnect: (connectionParams, webSocket, context) => {
      console.log(context);
    },
    onDisconnect: (webSocket, context) => {
      console.log(context);
    },
  },
  context: ({ ctx }) => {
    if (ctx) {
      const { req } = ctx;

      // Get the user token from the headers
      const authorization = req.headers.authorization || '';
      let token = '';

      if (req.headers.authorization) {
        [, token] = authorization.split(' ');
      }

      // Verify jwt and add session data to context
      try {
        const session = jwt.verify(token, SECRET);

        return { session };
      } catch (e) {
        return {};
      }
    } else {
      return {};
    }
  },
});

// Create Koa2 app
const app = new Koa();
app.use(cors());
server.applyMiddleware({ app });

const httpServer = app.listen(port, host, () => {
  logger.info(`🚀 GraphQL server ready at http://localhost:${port}${server.graphqlPath}`);
});

server.installSubscriptionHandlers(httpServer);

logger.info(`🚀 Subscriptions server ready at ws://localhost:${port}${server.subscriptionsPath}`);

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
