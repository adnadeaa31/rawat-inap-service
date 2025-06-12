const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const schema = require('./schema');
const resolvers = require('./resolvers');
const apiRoutes = require('./routes/api');
const db = require('./db'); // jika butuh akses langsung ke DB juga

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // REST API routes
  app.use('/api', apiRoutes);

  // Setup Apollo Server
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`✅ REST API     : http://localhost:${PORT}/api/kamar`);
    console.log(`🚀 GraphQL API : http://localhost:${PORT}/graphql`);
  });
}

startServer().catch(console.error);
