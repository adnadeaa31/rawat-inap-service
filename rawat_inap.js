const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const schema = require('./schema');     // typeDefs
const resolvers = require('./resolvers');

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json()); // diperlukan jika kamu matikan bodyParser Apollo

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({
    app,
    path: '/graphql',
    bodyParserConfig: false, // ✅ hindari konflik parser
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 GraphQL Server is running at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch(console.error);
