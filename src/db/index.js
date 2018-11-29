import { modelSchema, mongoModels } from './model';
import { mutationSchema, mutationResolvers } from './mutations';
import { querySchema, queryResolvers } from './queries';
import { subscriptionSchema, subscriptionResolvers } from './subscriptions';

/**
 * Merge schemas
 */
const gqlSchema = `
${modelSchema}
${mutationSchema}
${querySchema}
${subscriptionSchema}
`
  .replace(/\n{2,}/g, '\n\n') // Remove unused newlines
  .trim(); // Remove leading and trailing white space

/**
 * Setup models
 */
const models = mongoModels;

/**
 * Merge resolvers
 */
const resolvers = {
  ...mutationResolvers,
  ...queryResolvers,
  ...subscriptionResolvers,
};

if (mutationResolvers) Object.assign(resolvers, mutationResolvers);

export default {
  gqlSchema,
  models,
  resolvers,
};
