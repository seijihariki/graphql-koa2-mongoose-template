import fs from 'fs';
import path from 'path';
import logger from '../../util/logging';

/**
 * Setup graphql types
 */
const typesTypeDir = path.join(__dirname, 'gql');
let gqlTypeFiles = fs.readdirSync(typesTypeDir);
gqlTypeFiles = gqlTypeFiles.filter(filename => filename.match(/\.graphql$/));

let modelSchemaBuilder = '';

gqlTypeFiles.forEach((filename) => {
  logger.info(`Loading GraphQL Type file: ${filename}`);
  try {
    const content = fs.readFileSync(path.join(typesTypeDir, filename));
    modelSchemaBuilder += content;
  } catch (e) {
    logger.error(e);
  }
});

const modelSchema = modelSchemaBuilder;

/**
 * Setup mongodb models
 */
const mongoModels = null;

export { modelSchema, mongoModels };
