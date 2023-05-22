import { createSchema, createYoga } from "graphql-yoga";

const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      cart(id: ID!): Cart!
    }

    type Cart {
      id: ID!
      totalItems: Int!
      items: [CartItem]
    }

    type CartItem {
      id: ID!
      name: String!
    }
  `,
  resolvers: {
    Query: {
      cart: (_, { id }) => ({
        id,
        totalItems: 1,
        items: [{ id: "item-1", name: "Stickers" }],
      }),
    },
  },
});

const { handleRequest } = createYoga({
  graphqlEndpoint: "/graphql",
  schema,
  fetchAPI: {
    Request: Request,
    Response: Response,
  },
});

export { handleRequest as GET, handleRequest as POST };
