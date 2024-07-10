import 'dotenv/config';
import express from 'express';
import appSetup from './utils/appSetup.js';
import appIndex from './hooks/index.hooks.js';

// handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.name} | ${err.message}`);
  process.exit(1);
});

const app = express();
const port = process.env.port || 3000;

appSetup(app);
app.get('/', (req, res) => {
  res.send('Hello World!');
});
appIndex(app);
const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log('Server shutting down...');
    process.exit(1);
  });
});

export default app;
