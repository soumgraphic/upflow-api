import { Router } from 'express';
import { DocumentController } from '../controllers/documents.controller';

const router: Router = Router();

const documentController = new DocumentController();

router.post('/', (req, res) => documentController.add(req, res));
router.get('/',  (req, res) => {
    if(req.query.name){
        // -- If query name is found, get document by name
        return documentController.getByName(req, res);
    } else {
        // -- Else get document list
        return documentController.get(req, res);
    }
});
router.get('/:id',  (req, res) =>  documentController.getById(req, res));
router.get('/:id/view',  (req, res) =>  documentController.getPdfDocumentFileById(req, res));
router.get('/:id/thumbnail',  (req, res) =>  documentController.getThumbnailOfPdfFileById(req, res));

export const DocumentRoute : Router = router;