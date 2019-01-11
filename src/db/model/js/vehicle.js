import Company from '../mongo/company';

export default {
  async company(parent) {
    const test = Company.findById(parent.company);
    return test;
  },
};
