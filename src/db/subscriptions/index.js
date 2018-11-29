import fs from 'fs';
import path from 'path';
import logger from '../../util/logging';
import resolvers from './js';

/**
 * Setup graphql subscriptions
 */
const subscriptionTypeDir = path.join(__dirname, 'sub_gql');
let gqlSubscriptionTypeFiles = fs.readdirSync(subscriptionTypeDir);
gqlSubscriptionTypeFiles = gqlSubscriptionTypeFiles.filter(filename => filename.match(/\.graphql$/));

let gqlSubscriptionTypes = '';

gqlSubscriptionTypeFiles.forEach((filename) => {
  logger.info(`Loading GraphQL Subscription file: ${filename}`);
  try {
    const content = fs.readFileSync(path.join(subscriptionTypeDir, filename));
    gqlSubscriptionTypes += content;
  } catch (e) {
    logger.error(e);
  }
});

/**
 * Merge graphql schemas
 */
const subscriptionSchema = gqlSubscriptionTypes.trim()
  ? `
type Subscription {
${gqlSubscriptionTypes.replace(/^/m, '  ')}
}`
  : '';

/**
 * Setup resolvers
 */
const subscriptionResolvers = resolvers
  ? {
    Subscription: {
      ...resolvers,
    },
  }
  : null;

export { subscriptionSchema, subscriptionResolvers };