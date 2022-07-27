import { ApolloServer } from "apollo-server";
import { getContext } from "./context";
import { schema } from "./schema";

export const server = new ApolloServer({
    schema,
    context: async ({ req }) => await getContext(req)
})

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});