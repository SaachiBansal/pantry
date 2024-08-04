// pages/api/upload.js
import { NextApiRequest, NextApiResponse } from 'next';
import { classifyImage } from '../app/lib/classifyImage';

export default async (req = NextApiRequest, res = NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const file = req.body.file; // handle file extraction properly
    const result = await classifyImage(file);

    res.status(200).json(result);
};
