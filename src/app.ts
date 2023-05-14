import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
  return console.log(`⚡️ Express server is running at http://localhost:${port}`);
});