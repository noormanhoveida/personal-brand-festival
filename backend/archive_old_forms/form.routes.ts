import { Router } from 'express';
import { FormController } from '../controllers/form.controller';

const router = Router();

// Public routes
router.get('/public/forms/:slug',        FormController.publicGet);
router.post('/public/forms/:slug/submit', FormController.publicSubmit);

// Admin routes (add your auth middleware before these in app.ts if needed)
router.get('/admin/forms',               FormController.list);
router.post('/admin/forms',              FormController.create);
router.get('/admin/forms/:id',           FormController.detail);
router.put('/admin/forms/:id',           FormController.update);
router.delete('/admin/forms/:id',        FormController.remove);
router.get('/admin/forms/:id/submissions', FormController.submissions);

export default router;
