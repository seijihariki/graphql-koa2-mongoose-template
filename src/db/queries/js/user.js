import { ApolloError } from 'apollo-server-koa';
import { models } from '../../model';

const { User } = models;

export default {
  async user(parent, args) {
    const user = await User.findById(args.id);

    if (!user) throw new ApolloError('User not found!', 404);

    return user;
  },
  async listUsers(parent, args) {
    // Build search query
    const query = {};
    if (args.filter) Object.assign(query, args.filter);

    if (args.searchString && args.searchString.trim().length > 0) {
      query.$text = { $search: args.searchString };
    }

    // Find people
    const users = await User.find(query)
      .skip(args.offset)
      .limit(args.limit)
      .exec();

    return users;
  },
};
