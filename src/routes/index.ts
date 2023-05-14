import {Router} from 'express';
import {DocumentRoute} from '../routes/documents.route';
import {WebhookRoute} from '../routes/webhooks.route';

const router: Router = Router();

router.get('/', (req, res) => {
    res.send({'welcome': 'Hello and welcome to our API (v1)'});
});

router.use('/documents', DocumentRoute);
router.use('/webhooks', WebhookRoute);

export const MainRouter: Router = router;