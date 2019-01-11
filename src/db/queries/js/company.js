import { ApolloError } from "apollo-server-koa";
import { models } from "../../model";

const { Company } = models;

export default {
  async company(parent, args) {
    const company = await Company.findById(args.id);

    if (!company) throw new ApolloError("Company not found!", 404);

    return company;
  }
};
