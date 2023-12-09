import 'dotenv/config';
import express from 'express';
import { execSync } from 'node:child_process';

const server = express();

server.use((req, res, next) => {
  if (req.headers['x-api-key'] !== process.env.API_KEY) {
    res.status(401);
    return res.json({ message: 'Unauthorized' });
  }

  return next();
});

server.get('/stop', async (req, res) => {
  console.log('Stopping server...');

  const execOutput = execSync('sudo systemctl stop terraria');

  res.status(200);
  return res.json({ message: execOutput.toString() });
});

(async () => {
  try {
    server.listen(process.env.PORT, () => {
      console.info('%s listening at port %s', server.name, process.env.PORT);
    });
  } catch (error) {
    console.error(error);
  }
})();
