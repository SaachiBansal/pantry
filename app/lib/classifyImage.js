// lib/classifyImage.js
import vision from '@google-cloud/vision';

export const classifyImage = async (file) => {
    const client = new vision.ImageAnnotatorClient();

    const [result] = await client.labelDetection(file);
    const labels = result.labelAnnotations;

    return labels;
};
