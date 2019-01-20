import { makeExecutableSchema } from 'graphql-tools';
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas';
import * as path from 'path';

const resolversArray = fileLoader(path.join(__dirname, './resolvers/'), { recursive: true, extensions: ['.js'] });
const typesArray = fileLoader(path.join(__dirname, './types/'), { recursive: true, extensions: ['.gql'] });
const resolvers = mergeResolvers(resolversArray);
const typeDefs = mergeTypes(typesArray, {all: true});
const schema = makeExecutableSchema({ typeDefs, resolvers });

export { schema };
