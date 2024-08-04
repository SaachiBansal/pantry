import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

const ImageUpload = ({ setClassifiedItems }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [imageElement, setImageElement] = useState(null);
    const [model, setModel] = useState(null);

    useEffect(() => {
        const loadModel = async () => {
            try {
                const loadedModel = await tf.loadGraphModel('/models/resnet50/model.json');
                setModel(loadedModel);
            } catch (error) {
                console.error('Error loading model:', error);
            }
        };
        loadModel();
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImageSrc(imageUrl);
        }
    };

    const handleImageLoad = (e) => {
        setImageElement(e.target);
    };

    const handleClassifyImage = async () => {
        if (!imageElement || !model) return;

        const tensor = tf.browser.fromPixels(imageElement)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat()
            .div(tf.scalar(127.5))
            .sub(tf.scalar(1));

        const predictions = await model.predict(tensor).array();

        // Assuming predictions is an array of probabilities
        const topPredictions = predictions[0]
            .map((p, i) => ({ probability: p, className: `Class ${i}` })) // Adjust this line to include actual class names if available
            .sort((a, b) => b.probability - a.probability)
            .slice(0, 3); // Get top 3 predictions

        setClassifiedItems(topPredictions);
    };

    return (
        <div>
            <input type="file" onChange={handleImageUpload} />
            {imageSrc && (
                <img
                    id="uploaded-image"
                    src={imageSrc}
                    alt="uploaded"
                    onLoad={handleImageLoad}
                    width="200"
                />
            )}
            {imageElement && (
                <button onClick={handleClassifyImage}>Classify Image</button>
            )}
        </div>
    );
};

export default ImageUpload;
