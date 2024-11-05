import { Request, Response, NextFunction } from 'express';
import * as contentService from '../services/contentServices';
import axios from 'axios';

const AI_API_KEY = process.env.AI_API_KEY;

export const getAllContent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const content = await contentService.fetchAllContent();
        res.json(content);
    } catch (error) {
        next(error);
    }
};

export const createContent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const newContent = await contentService.createContent(req.body);
        res.status(201).json(newContent);
    } catch (error) {
        next(error);
    }
};

export const deleteContent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await contentService.deleteContent(req.params.id);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

export const generateTagsWithAI = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { title, body } = req.body;
    if (!title && !body) {
        res.status(400).json({ message: "Title or body is required to generate tags." });
        return;
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'Generate relevant tags for the following content.' },
                    { role: 'user', content: `Title: ${title}\nBody: ${body}` }
                ],
                max_tokens: 50,
            },
            {
                headers: {
                    Authorization: `Bearer ${AI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const aiResponse = response.data.choices[0].message.content;
        const tags = aiResponse.split(',').map((tag: string) => tag.trim());
        res.json({ tags });
    } catch (error) {
        next(error);
    }
};
