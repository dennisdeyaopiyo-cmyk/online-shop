import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Shared Gemini client configured according to skill guidelines
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Search Grounding API for trending footwear & advice
  app.post('/api/gemini/search-grounding', async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query string is required' });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: query,
        config: {
          systemInstruction: 'You are an expert footwear consultant and sneaker advisor for Kenyan shoppers. Provide accurate, up-to-date footwear information, release details, styling advice, and sizing comparisons with reference to Kenyan market prices in KSh where helpful.',
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || '';
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources: Array<{ title: string; uri: string }> = [];

      for (const chunk of groundingChunks) {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || chunk.web.uri,
            uri: chunk.web.uri,
          });
        }
      }

      res.json({
        text,
        sources,
      });
    } catch (err: any) {
      console.error('Error in Search Grounding:', err);
      res.status(500).json({
        error: err?.message || 'Failed to fetch search-grounded footwear information',
      });
    }
  });

  // Maps Grounding API for store, delivery hub & courier pickup locations
  app.post('/api/gemini/maps-grounding', async (req, res) => {
    try {
      const { prompt, location } = req.body;
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt string is required' });
      }

      // Default coordinates: Nairobi CBD (-1.286389, 36.817223)
      const latLng = location && typeof location.latitude === 'number' && typeof location.longitude === 'number'
        ? { latitude: location.latitude, longitude: location.longitude }
        : { latitude: -1.286389, longitude: 36.817223 };

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are a Kenya footwear logistics and shoe store locator specialist. Assist Kenyan customers in finding nearby footwear retail stores, pickup stations, Safaricom M-Pesa agents, and courier parcel offices (such as G4S Kenya, Wells Fargo, Fargo Courier, Easy Coach, or Speedex) in Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, and surrounding towns.',
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng,
            },
          },
        },
      });

      const text = response.text || '';
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const mapsSources: Array<{ title: string; uri: string }> = [];

      for (const chunk of groundingChunks) {
        if (chunk.maps?.uri) {
          mapsSources.push({
            title: chunk.maps.title || 'Open in Google Maps',
            uri: chunk.maps.uri,
          });
        }
      }

      res.json({
        text,
        mapsSources,
      });
    } catch (err: any) {
      console.error('Error in Maps Grounding:', err);
      res.status(500).json({
        error: err?.message || 'Failed to locate delivery hubs via Google Maps',
      });
    }
  });

  // Vite middleware in dev, static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
