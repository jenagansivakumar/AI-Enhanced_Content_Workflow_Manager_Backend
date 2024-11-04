import axios from 'axios';
import Content from '../models/contentModels';
import { ContentData } from '../types/ContentItem';

const AI_API_KEY = process.env.AI_API_KEY;

export async function createContent(data: ContentData) {
    const tags = await generateTagsWithAI(data.title, data.body);
    const newContent = new Content({ ...data, tags });
    return await newContent.save();
}


export async function fetchAllContent() {
    try {
        return await Content.find();  // Fetches all documents from the Content collection
    } catch (error) {
        throw new Error("Failed to fetch content");
    }
}

async function generateTagsWithAI(title: string, body: string): Promise<string[]> {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'Generate relevant tags for content based on its title and body.' },
                    { role: 'user', content: `Title: ${title}\nBody: ${body}` }
                ],
                max_tokens: 50,
            },
            {
                headers: {
                    'Authorization': `Bearer ${AI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const aiResponse = response.data.choices[0].message.content;
        return aiResponse.split(',').map((tag: string) => tag.trim());
    } catch (error) {
        console.error("Error generating AI tags:", error);
        return [];
    }
}
