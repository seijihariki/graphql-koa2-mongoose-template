import fs from 'fs';
import path from 'path';
import logger from '../../util/logging';
import resolvers from './js';

/**
 * Setup graphql queries
 */
const queryTypeDir = path.join(__dirname, 'qry_gql');
let gqlQueryTypeFiles = fs.readdirSync(queryTypeDir);
gqlQueryTypeFiles = gqlQueryTypeFiles.filter(filename => filename.match(/\.graphql$/));

let gqlQueryTypes = '';

gqlQueryTypeFiles.forEach((filename) => {
  logger.info(`Loading GraphQL Query file: ${filename}`);
  try {
    const content = fs.readFileSync(path.join(queryTypeDir, filename));
    gqlQueryTypes += content;
  } catch (e) {
    logger.error(e);
  }
});

/**
 * Merge graphql schemas
 */
const querySchema = gqlQueryTypes.trim()
  ? `
type Query {
${gqlQueryTypes.replace(/^/m, '  ')}
}`
  : '';

/**
 * Setup resolvers
 */
const queryResolvers = resolvers
  ? {
    Query: {
      ...resolvers,
    },
  }
  : null;

export { querySchema, queryResolvers };
