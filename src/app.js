import 'dotenv/config';
import express from 'express';
import appSetup from './utils/appSetup.js';
import appIndex from './hooks/index.hooks.js';

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.name} | ${err.message}`);
  process.exit(1);
});

// process.env.DATABASE_URL =
//   process.env.NODE_ENV === 'dev'
//     ? process.env.DATABASE_URL_DEV
//     : process.env.DATABASE_URL_PROD;

const app = express();
const port = process.env.port || 3000;

appSetup(app);
appIndex(app);

const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log('Server shutting down...');
    process.exit(1);
  });
});

export default app;
