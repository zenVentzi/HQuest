import { writeFileSync } from "fs";
import { fileLoader, mergeResolvers, mergeTypes } from "merge-graphql-schemas";
import path from "path";

const typesArray = fileLoader(path.join(__dirname, "./modules/**/*.graphql"));
const typeDefs: any = mergeTypes(typesArray, { all: true });
writeFileSync("joined.graphql", typeDefs);

// const resolversArray = fileLoader(
//   path.join(__dirname, "./modules/**/resolvers.ts")
// );

// const resolvers = mergeResolvers(resolversArray);
