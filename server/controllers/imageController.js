// Image Generation Controller (Gemini Image Generation)
import { GoogleGenAI } from '@google/genai';

let aiClient = null;

function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured on the server.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export const generateImage = async (req, res) => {
  try {
    const {
      prompt,
      model = 'gemini-3.1-flash-image',
      aspectRatio = '1:1',
      imageSize = '1K',
    } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Supported aspect ratios and sizes
    const validRatios = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'];
    const validSizes = ['1K', '2K', '4K'];

    const chosenRatio = validRatios.includes(aspectRatio) ? aspectRatio : '1:1';
    const chosenSize = validSizes.includes(imageSize) ? imageSize : '1K';
    const chosenModel = model === 'gemini-3-pro-image' ? 'gemini-3-pro-image' : 'gemini-3.1-flash-image';

    const ai = getAiClient();

    const response = await ai.models.generateContent({
      model: chosenModel,
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: chosenRatio,
          imageSize: chosenSize,
        },
      },
    });

    let imageUrl = null;
    let descriptionText = '';

    if (response?.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        } else if (part.text) {
          descriptionText += part.text;
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({
        error: 'The AI model completed the request but did not return an image part.',
        details: descriptionText,
      });
    }

    res.json({
      success: true,
      imageUrl,
      model: chosenModel,
      aspectRatio: chosenRatio,
      imageSize: chosenSize,
      descriptionText,
    });
  } catch (err) {
    console.error('Gemini image generation error:', err);
    res.status(500).json({
      error: err.message || 'Failed to generate image',
    });
  }
};
