import Vehicle from '../mongo/vehicle';

export default {
  async vehicle(parent) {
    return Vehicle.findById(parent.vehicle);
  },
};
