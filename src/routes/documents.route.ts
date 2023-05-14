import { Request, Response, Router } from 'express';
import { DocumentController } from '../controllers/documents.controller';

const router: Router = Router();

const documentController = new DocumentController();

router.post('/', (req, res) => documentController.add(req, res));
router.get('/', (req, res) => documentController.get(req, res));

export const DocumentRoute : Router = router;