import 'dotenv/config';
import express from 'express';
import appSetup from './utils/appSetup.js';
import appIndex from './hooks/index.hooks.js';

const app = express();
const port = process.env.port || 3000;

appSetup(app);
appIndex(app);

const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

server.on('unhandledRejection', (err) => {
  console.error(`unhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log('Server shutting down...');
    process.exit(1);
  });
});

export default app;
