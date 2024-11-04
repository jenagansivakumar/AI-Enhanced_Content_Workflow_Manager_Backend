
import express from 'express';
import * as contentController from '../controllers/contentController';

const router = express.Router();

router.get('/content', contentController.getAllContent);  
router.post('/content', contentController.createContent);  
router.delete('/content/:id', contentController.deleteContent)

export default router;
