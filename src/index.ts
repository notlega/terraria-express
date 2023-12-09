import 'dotenv/config';
import express from 'express';
import { exec } from 'node:child_process';

const server = express();

server.use((req, res, next) => {
  if (req.headers['x-api-key'] !== process.env.API_KEY) {
    res.status(401);
    return res.json({ message: 'Unauthorized' });
  }

  return next();
});

server.get('/stop', async (req, res) => {
  const { stdout, stderr } = await exec('sudo systemctl stop terraria');

  if (stderr) {
    console.error(`error: ${stderr}`);
    res.status(500);
    return res.json({ message: stderr });
  }

  res.status(200);
  return res.json({ message: stdout });
});

server.get('/players', async (req, res) => {
  const { stdout, stderr } = await exec('sudo terrariad inject playing');

  if (stderr) {
    console.error(`error: ${stderr}`);
    res.status(500);
    return res.json({ message: stderr });
  }

  res.status(200);
  return res.json({ message: stdout });
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
