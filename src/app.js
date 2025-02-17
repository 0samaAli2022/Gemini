import express from 'express';
import appSetup from './utils/appSetup.js';
import appIndex from './hooks/index.hooks.js';
import dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'dev';
console.log(`Environment: ${env}`);
if (env === 'dev') dotenv.config({ path: '.env.dev' });
else dotenv.config({ path: '.env' });

// handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.name} | ${err.message}`);
  process.exit(1);
});

const app = express();
const port = process.env.PORT || 3000;

appSetup(app);
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
