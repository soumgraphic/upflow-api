import {Router} from 'express';
import {DocumentRoute} from '../routes/documents.route';

const router: Router = Router();

router.get('/', (req, res) => {
    res.send({'welcome': 'Hello and welcome to Upflow documents API (v1)'});
});

router.use('/documents', DocumentRoute);

export const MainRouter: Router = router;

