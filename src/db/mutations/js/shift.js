import { ApolloError } from "apollo-server-koa";
import { models } from "../../model";

const { Shift, Vehicle } = models;

export default {
  async startShift(parent, args, context) {
    // Login guard
    if (!context.session) throw new ApolloError("Must be logged in", 403);

    // Find vehicle
    const vehicles = await Vehicle.find(args.vehicle).limit(2);
    if (vehicles.length > 1)
      throw new ApolloError("Vehicle query is too broad", 400);
    if (vehicles.length < 1)
      throw new ApolloError("Vehicle was not found", 404);

    const [vehicle] = vehicles;

    // Find shift using this vehicle or create one
    let shift = await Shift.findOne({
      endTime: null,
      "vehicle._id": vehicle.id
    });
    if (!shift) {
      shift = new Shift({
        startTime: Date.now(),
        vehicle: vehicle.id
      });
    }

    // Add user to shift
    shift.users.push(context.session.user);

    try {
      await shift.save();
    } catch (e) {
      throw new ApolloError("Failed starting shift", 500);
    }

    return shift;
  }
};
