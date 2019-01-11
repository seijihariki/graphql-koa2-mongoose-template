import personMutation from './person';
import userMutation from './user';
import companyMutation from './company';
import vehicleMutation from './vehicle';
import shiftMutation from './shift';

export default {
  ...personMutation,
  ...userMutation,
  ...companyMutation,
  ...vehicleMutation,
  ...shiftMutation,
};
