import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { loadFilesSync } from "@graphql-tools/load-files";
import * as path from 'path';

const resolversArray = loadFilesSync(path.join(__dirname, "./resolvers/"), {
    recursive: true,
    extensions: ["js"],
  });
  const typesArray = loadFilesSync(path.join(__dirname, "./types/"), {
    recursive: true,
    extensions: ["gql"],
  });
  
  const typeDefs = mergeTypeDefs(typesArray, { all: true });
  const resolvers = mergeResolvers(resolversArray);
  
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  export { schema };
