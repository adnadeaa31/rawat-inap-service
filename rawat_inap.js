const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const schema = require('./schema');     // typeDefs
const resolvers = require('./resolvers');

require('dotenv').config(); 
const PORT = process.env.PORT || 8003;

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

  const PORT = process.env.PORT || 8003;
  app.listen(PORT, () => {
    console.log(`🚀 GraphQL Server is running at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch(console.error);
