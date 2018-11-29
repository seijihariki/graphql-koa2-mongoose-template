import fs from 'fs';
import path from 'path';
import logger from '../../util/logging';
import resolvers from './js';

/**
 * Setup graphql input types
 */
const inputTypeDir = path.join(__dirname, 'in_gql');
let gqlInputTypeFiles = fs.readdirSync(inputTypeDir);
gqlInputTypeFiles = gqlInputTypeFiles.filter(filename => filename.match(/\.graphql$/));

let gqlInputTypes = '';

gqlInputTypeFiles.forEach((filename) => {
  logger.info(`Loading GraphQL Input file: ${filename}`);
  try {
    const content = fs.readFileSync(path.join(inputTypeDir, filename));
    gqlInputTypes += content;
  } catch (e) {
    logger.error(e);
  }
});

/**
 * Setup graphql mutations
 */
const mutationTypeDir = path.join(__dirname, 'mut_gql');
let gqlMutationTypeFiles = fs.readdirSync(mutationTypeDir);
gqlMutationTypeFiles = gqlMutationTypeFiles.filter(filename => filename.match(/\.graphql$/));

let gqlMutationTypes = '';

gqlMutationTypeFiles.forEach((filename) => {
  logger.info(`Loading GraphQL Mutation file: ${filename}`);
  try {
    const content = fs.readFileSync(path.join(mutationTypeDir, filename));
    gqlMutationTypes += content;
  } catch (e) {
    logger.error(e);
  }
});

/**
 * Merge graphql schemas
 */
gqlMutationTypes = gqlMutationTypes.trim()
  ? `
type Mutation {
${gqlMutationTypes.replace(/^/m, '  ')}
}`
  : '';

const mutationSchema = `
${gqlInputTypes}

${gqlMutationTypes}`;

/**
 * Setup resolvers
 */
const mutationResolvers = resolvers
  ? {
    Mutation: {
      ...resolvers,
    },
  }
  : null;

export { mutationSchema, mutationResolvers };
