import { ApolloError } from 'apollo-server-koa';
import { models } from '../../model';

const { Person } = models;

export default {
  async person(parent, args) {
    const person = await Person.findById(args.id);

    if (!person) throw new ApolloError('Person not found!', 404);

    return person;
  },
  async listPeople(parent, args) {
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
