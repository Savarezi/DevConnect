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
      const timestamp = new Date().toISOString();
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `Gere uma dica técnica inédita e aleatória sobre desenvolvimento de software (máx 140 caracteres). Ref: ${seed}-${timestamp}. Seja criativo e evite clichês.`,
        config: {
          systemInstruction: "Você é um mentor técnico disruptivo. Sua missão é fornecer conselhos práticos, curtos e raros para desenvolvedores. Nunca use o mesmo conselho duas vezes. Mude o assunto a cada pedido (ex: performance, design, mindset, segurança).",
          temperature: 1.0,
        }
      });
      
      return response.text?.trim() || "Mantenha seu código limpo e seus testes em dia.";
    } catch (error) {
      console.error('Error generating tech tip:', error);
      return "Otimize seu fluxo de trabalho com foco em entrega de valor.";
    }
  }
};
