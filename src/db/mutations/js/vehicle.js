import { ApolloError } from 'apollo-server-koa';
import { models } from '../../model';
import logger from '../../../util/logging';

const { Vehicle, Company } = models;

export default {
  async createVehicle(parent, args) {
    // Check input
    const { data } = args;

    if (!data.state) data.state = 'ACTIVE';

    if (!data.identifier || !data.identifier.idType || !data.identifier.number) throw new ApolloError('Identifier is required', 400);
    if (await Vehicle.findOne({ identifier: data.identifier })) throw new ApolloError('This vehicle is already registered', 409);
    if (!data.company) throw new ApolloError('Company is required', 400);
    const company = await Company.find(data.company).limit(2);
    if (company.length > 1) throw new ApolloError('Company query is too broad', 400);
    if (company.length < 1) throw new ApolloError('Company was not found', 404);

    data.company = company[0].id;

    // Create Vehicle
    const vehicle = new Vehicle(data);

    try {
      await vehicle.save();
    } catch (e) {
      throw new ApolloError('Failed to create Vehicle', 500);
    }

    return vehicle;
  },
};
