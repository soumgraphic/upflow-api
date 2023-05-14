import express from 'express';
import {MainRouter} from './routes/index';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api/v1', MainRouter);

app.listen(port, () => {
  return console.log(`⚡️ Express server is running at http://localhost:${port}`);
});