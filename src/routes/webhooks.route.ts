import { Router } from 'express';
import { WebhookController } from '../controllers/webhooks.controller';

const router: Router = Router();

const webhookController = new WebhookController();

router.post('/', (req, res) => webhookController.consumeWebhookEvents(req, res));

export const WebhookRoute : Router = router;