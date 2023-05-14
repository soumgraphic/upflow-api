import express from 'express';
import {Router} from 'express';

const app = express();
const port = 3000;
const router: Router = Router();

router.get('/', (req, res) => {
    res.send({'welcome': 'Hello and welcome to our API (v1)'});
});

app.use(express.json());
app.use(router);

app.listen(port, () => {
  return console.log(`⚡️ Express server is running at http://localhost:${port}`);
});