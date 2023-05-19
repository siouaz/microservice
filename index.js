const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const express = require('express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const productRoutes = require('./routes/api/productRoutes');
const MONGODB = "mongodb+srv://admin:admin@cluster0.9urljun.mongodb.net/?retryWrites=true&w=majority";

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers
});

app.use(express.json());

app.use('/products', productRoutes);

(async () => {
  await server.start();

  server.applyMiddleware({ app });

  await mongoose.connect(MONGODB, { useNewUrlParser: true });

  app.listen({ port: 5000 }, () => {
    console.log('Server running at http://localhost:5000');
  });
})();
