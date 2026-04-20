/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

export const geminiService = {
  generateTechTip: async (): Promise<string> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const seed = Math.random().toString(36).substring(7);
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `Gere uma dica técnica curta (máx 140 chars) e única sobre programação ou produtividade. Contexto aleatório: ${seed}. Use um tom moderno.`,
        config: {
          systemInstruction: "Você é um mentor sênior. Seja direto, técnico e inspirador. Nunca repita a mesma dica.",
          temperature: 0.9,
        }
      });
      
      return response.text?.trim() || "Mantenha seu código limpo e seus testes em dia.";
    } catch (error) {
      console.error('Error generating tech tip:', error);
      return "Otimize seu fluxo de trabalho com foco em entrega de valor.";
    }
  }
};
