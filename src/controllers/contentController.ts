import { Request, Response, NextFunction } from 'express';
import * as contentService from '../services/contentServices';

export const getAllContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const content = await contentService.fetchAllContent();  
        res.json(content);
    } catch (error) {
        next(error);
    }
};

export const createContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newContent = await contentService.createContent(req.body);
        res.status(201).json(newContent);
    } catch (error) {
        next(error);
    }
};

export const deleteContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
      await contentService.deleteContent(req.params.id);
      res.status(204).end();
  } catch (error) {
      next(error);
  }
};