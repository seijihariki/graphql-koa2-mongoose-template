import { ApolloError } from 'apollo-server-koa';
import { models } from '../../model';

const { Company } = models;

export default {
  async company(parent, args) {
    const company = await Company.findById(args.id);

    if (!company) throw new ApolloError('Company not found!', 404);

    return company;
  },
  async listCompanies(parent, args) {
    // Build search query
    const query = {};
    if (args.filter) Object.assign(query, args.filter);

    if (args.searchString && args.searchString.trim().length > 0) {
      query.$text = { $search: args.searchString };
    }

    // Find people
    const companies = await Company.find(query)
      .skip(args.offset)
      .limit(args.limit)
      .exec();

    return companies;
  },
};
