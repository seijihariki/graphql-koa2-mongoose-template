import Company from '../mongo/company';
import Person from '../mongo/person';

export default {
  async company(parent) {
    return Company.findById(parent.company);
  },
  async person(parent) {
    return Person.findById(parent.person);
  },
};
