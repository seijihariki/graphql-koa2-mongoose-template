import personQuery from "./person";
import companyQuery from "./company";
import userQuery from "./user";

export default {
  ...personQuery,
  ...companyQuery,
  ...userQuery
};
