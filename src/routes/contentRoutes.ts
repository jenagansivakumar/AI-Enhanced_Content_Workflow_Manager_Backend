import { Router } from 'express';
import { getAllContent, createContent, updateContent, deleteContent } from '../controllers/contentController';

const router = Router();

router.get('/', getAllContent);
router.post('/', createContent);
router.put('/:id', updateContent);
router.delete('/:id', deleteContent);

export default router;
