const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const schema = require('./schema');
const resolvers = require('./resolvers');
const db = require('./db'); // pakai koneksi db langsung

async function startServer() {
  const app = express();

  // API REST root untuk konsumsi service lain
  app.get('/api/kamar', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM kamar');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching kamar:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/rawat_inap', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM rawat_inap');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching rawat_inap:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/diagnosa_inap', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM diagnosa_inap');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching diagnosa_inap:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/tindakan_inap', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM tindakan_inap');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching tindakan_inap:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // GraphQL server
  const server = new ApolloServer({ typeDefs: schema, resolvers });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`✅ REST API: http://localhost:${PORT}/api/kamar`);
    console.log(`🚀 GraphQL: http://localhost:${PORT}/graphql`);
  });
}

startServer().catch(console.error);
