import { models } from '../../model';
import generics from './generic';

const { genericListingQuery } = generics;

const {
  Company, Document, Person, Shift, Trip, User, Vehicle,
} = models;

export default {
  async listCompanies(parent, args) {
    return genericListingQuery(args, Company);
  },
  async listDocuments(parent, args) {
    return genericListingQuery(args, Document);
  },
  async listPeople(parent, args) {
    return genericListingQuery(args, Person);
  },
  async listShifts(parent, args) {
    return genericListingQuery(args, Shift);
  },
  async listTrips(parent, args) {
    return genericListingQuery(args, Trip);
  },
  async listUsers(parent, args) {
    return genericListingQuery(args, User);
  },
  async listVehicles(parent, args) {
    return genericListingQuery(args, Vehicle);
  },
};
