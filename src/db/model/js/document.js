import Person from '../mongo/person';

export default {
  async person(parent) {
    return Person.findById(parent.person);
  },
};
