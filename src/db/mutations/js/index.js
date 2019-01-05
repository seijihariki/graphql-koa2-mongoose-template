import personMutation from './person';
import userMutation from './user';
import companyMutation from './company';

export default {
  ...personMutation,
  ...userMutation,
  ...companyMutation,
};
