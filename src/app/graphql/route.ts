import SchemaBuilder from "@pothos/core";
import { createYoga } from "graphql-yoga";

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (parent, { name }) => `hello, ${name || "World"}`,
    }),
  }),
});

const { handleRequest } = createYoga({
  graphqlEndpoint: "/graphql",
  schema: builder.toSchema(),
  fetchAPI: {
    Request: Request,
    Response: Response,
  },
});

export { handleRequest as GET, handleRequest as POST };
