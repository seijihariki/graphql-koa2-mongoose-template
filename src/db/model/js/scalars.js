import { GraphQLScalarType } from 'graphql';

// Datetime
const datetimeScalar = new GraphQLScalarType({
  name: 'Datetime',
  description: 'Stores ISO Datetime',
  parseValue(v) {
    return new Date(v);
  },
  serialize(v) {
    return v.toISOString();
  },
  parseLiteral(ast) {
    return ast;
  },
});

export default {};
