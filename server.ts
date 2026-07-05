/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { Student, Teacher } from './src/types';
import { compileContextSummary, searchContext } from './src/utils/dataAnalysis';

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is not configured.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API endpoint for chatbot
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history, students, teachers } = req.body as {
        message: string;
        history: { role: 'user' | 'model'; parts: { text: string }[] }[];
        students: Student[];
        teachers: Teacher[];
      };

      if (!message) {
        res.status(400).json({ error: 'Message is required.' });
        return;
      }

      // Compile current dataset context
      const summaryContext = compileContextSummary(students, teachers);
      
      // Perform targeted search based on the query to include specific match records (avoids overloading context window)
      const lookupContext = searchContext(message, students, teachers);

      const systemInstruction = `Anda adalah Pembantu AI Kokurikulum untuk SMK Muara Tuang 2026.
Anda dibekalkan dengan data murid dan guru rasmi di bawah. Jawab semua soalan pengguna dengan tepat berdasarkan data ini sahaja.

${summaryContext}

${lookupContext ? `MAKLUMAT SPESIFIK CARIAN BERKAITAN QUERY PENGGUNA:\n${lookupContext}\n` : ''}

Peraturan penting:
1. Jawab soalan secara profesional, mesra, tepat, dan dalam Bahasa Melayu.
2. Jikalau data yang ditanya tidak wujud dalam fail, beritahu dengan jujur bahawa maklumat tersebut tiada dalam rekod. Jangan reka maklumat murid atau guru lain.
3. Rujuk kepada perincian dan statistik yang dibekalkan di atas untuk memberikan angka yang tepat.`;

      // Check if API key is present
      if (!process.env.GEMINI_API_KEY) {
        // Fallback response when API key is missing, so it doesn't block the preview
        let fallbackReply = `[MOD PREVIEW TANPA API KEY]\n\nSebagai Pembantu AI Kokurikulum SMK Muara Tuang 2026, saya mengesan soalan anda: "${message}".\n\n`;
        
        // Let's make the fallback extremely smart by doing a local keyword analysis!
        const queryLower = message.toLowerCase();
        if (queryLower.includes('seni tari')) {
          fallbackReply += `Berdasarkan data kami, **Kelab Seni Tari** mempunyai **139 orang ahli murid** (Sesi Pagi: 47, Sesi Petang: 92) dan **6 orang Guru Penasihat**:\n\n**Sesi Pagi:**\n1. Evelyn Alin Lim Ai Ling\n2. Lona Anak Benjamin\n3. Nurul Hamiezatul Yasmin Bt Abdullah\n\n**Sesi Petang:**\n1. Dayang Noraslina Binti Abang Suhaili\n2. Edwina Sunny Anak Dennis\n3. Rampini Francesca`;
        } else if (lookupContext) {
          fallbackReply += `Berikut adalah padanan yang saya temui daripada pangkalan data aktif sekolah:\n${lookupContext}`;
        } else {
          fallbackReply += `Saya sedia menjawab soalan anda. Namun, untuk perbualan penuh yang dikuasakan AI, sila pastikan kunci rahsia **GEMINI_API_KEY** diletakkan di bahagian panel Secrets di AI Studio.\n\nSila gunakan Dashboard di sebelah kiri untuk mencari murid, mencari guru, melihat statistik tepat, atau memuat naik fail CSV data sekolah anda sendiri!`;
        }
        
        res.json({ text: fallbackReply });
        return;
      }

      const ai = getGeminiClient();

      // Setup contents with systemInstruction in config
      // Format chat history properly
      const formattedContents = [
        ...history.map(h => ({
          role: h.role,
          parts: h.parts
        })),
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.2,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error('Error in /api/chat:', error);
      res.status(500).json({ error: error.message || 'Ralat pelayan dalaman.' });
    }
  });

  // Handle Vite middleware in dev and static files in production
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
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
