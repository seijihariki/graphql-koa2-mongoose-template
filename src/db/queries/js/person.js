import { ApolloError } from 'apollo-server-koa';
import { models } from '../../model';
import logger from '../../../util/logging';

const { Person, Document } = models;

export default {
  async listPeople(parent, args, context, info) {
    // Build search query
    const query = {};
    if (args.filter) Object.assign(query, args.filter);

    if (args.searchString && args.searchString.trim().length > 0) {
      query.$text = { $search: args.searchString };
    }

    // Find people
    const people = await Person.find(query)
      .skip(args.offset)
      .limit(args.limit)
      .exec();

    return people;
  },
};
