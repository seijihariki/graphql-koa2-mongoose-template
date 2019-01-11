import { ApolloError } from "apollo-server-koa";

async function genericDirectQuery(args, model) {
  const object = await model.findById(args.id);

  if (!object)
    throw new ApolloError(`${model.constructor.modelName} not found!`, 404);
  return object;
}

async function genericListingQuery(args, model) {
  // Build search query
  const query = {};
  if (args.filter) Object.assign(query, args.filter);

  if (args.searchString && args.searchString.trim().length > 0) {
    query.$text = { $search: args.searchString };
  }

  // Find matching
  const matching = await model
    .find(query)
    .skip(args.offset)
    .limit(args.limit)
    .exec();

  return matching;
}

export default {
  genericDirectQuery,
  genericListingQuery
};
