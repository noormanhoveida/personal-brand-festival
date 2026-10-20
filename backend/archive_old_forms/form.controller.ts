import { Request, Response } from 'express';
import { FormService } from '../services/form.service';

export const FormController = {
  // Admin: list all forms
  async list(req: Request, res: Response) {
    try {
      const forms = await FormService.getAll();
      res.json({ success: true, data: forms });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // Admin: get single form with submissions
  async detail(req: Request, res: Response) {
    try {
      const form = await FormService.getById(req.params.id);
      if (!form) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: form });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // Admin: create form
  async create(req: Request, res: Response) {
    try {
      const form = await FormService.create(req.body);
      res.status(201).json({ success: true, data: form });
    } catch (err) {
      res.status(400).json({ success: false, message: (err as Error).message });
    }
  },

  // Admin: update form
  async update(req: Request, res: Response) {
    try {
      const form = await FormService.update(req.params.id, req.body);
      res.json({ success: true, data: form });
    } catch (err) {
      res.status(400).json({ success: false, message: (err as Error).message });
    }
  },

  // Admin: delete form
  async remove(req: Request, res: Response) {
    try {
      await FormService.delete(req.params.id);
      res.json({ success: true, message: 'Deleted' });
    } catch (err) {
      res.status(400).json({ success: false, message: (err as Error).message });
    }
  },

  // Public: get published form by slug
  async publicGet(req: Request, res: Response) {
    try {
      const form = await FormService.getBySlug(req.params.slug);
      if (!form || !form.isActive) {
        return res.status(404).json({ success: false, message: 'Form not found' });
      }
      // strip submissions from public response
      const { ...publicForm } = form;
      res.json({ success: true, data: publicForm });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // Public: submit form
  async publicSubmit(req: Request, res: Response) {
    try {
      const submission = await FormService.submit(req.params.slug, req.body);
      res.status(201).json({ success: true, data: submission });
    } catch (err) {
      res.status(400).json({ success: false, message: (err as Error).message });
    }
  },

  // Admin: get submissions for a form
  async submissions(req: Request, res: Response) {
    try {
      const data = await FormService.getSubmissions(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },
};
