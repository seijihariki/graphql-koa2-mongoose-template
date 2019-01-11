import { models } from "../../model";
import generics from "./generic";

const { genericDirectQuery } = generics;

const { Company, Document, Person, Shift, Trip, User, Vehicle } = models;

export default {
  async company(parent, args, context) {
    // Check for permissions
    let user = null;
    console.log(context.session);
    if (context.session) user = await User.findById(context.session.user);

    return genericDirectQuery(args, Company);
  },
  async document(parent, args) {
    return genericDirectQuery(args, Document);
  },
  async person(parent, args) {
    return genericDirectQuery(args, Person);
  },
  async shift(parent, args) {
    return genericDirectQuery(args, Shift);
  },
  async trip(parent, args) {
    return genericDirectQuery(args, Trip);
  },
  async user(parent, args) {
    return genericDirectQuery(args, User);
  },
  async vehicle(parent, args) {
    return genericDirectQuery(args, Vehicle);
  }
};
