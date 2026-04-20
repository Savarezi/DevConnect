/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

export const geminiService = {
  generateTechTip: async (): Promise<string> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Gere uma dica técnica curta, inspiradora e útil para desenvolvedores (máximo 150 caracteres). Use um tom moderno e direto. Evite emojis excessivos.",
        config: {
          systemInstruction: "Você é um mentor técnico sênior especializado em produtividade e boas práticas de programação.",
          temperature: 0.8,
        }
      });
      
      return response.text?.trim() || "Mantenha seu código limpo e seus testes em dia.";
    } catch (error) {
      console.error('Error generating tech tip:', error);
      return "Otimize seu fluxo de trabalho com foco em entrega de valor.";
    }
  }
};
