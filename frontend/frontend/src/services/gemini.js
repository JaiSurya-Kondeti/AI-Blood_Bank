import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  "API_KEY"
);

export async function askAI(
  message,
  language
) {
  const model =
    genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

  const prompt = `
You are an AI Predictive Blood Crisis Prevention Assistant.

Respond ONLY in ${language}.

User Question:
${message}
`;

  const result =
    await model.generateContent(prompt);

  return result.response.text();
}
