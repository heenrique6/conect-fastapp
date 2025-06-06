// Importa as bibliotecas e plugins principais do Genkit.
import {genkit, z} from "genkit";
import {vertexAI, gemini20Flash} from "@genkit-ai/vertexai";
import {onCallGenkit} from "firebase-functions/v2/https"; // Alterado para v2 para consistência
import {defineSecret} from "firebase-functions/params";
import {enableFirebaseTelemetry} from "@genkit-ai/firebase";

// Define a chave da API como um segredo.
const apiKey = defineSecret("GOOGLE_GENAI_API_KEY");

// Habilita a telemetria do Firebase para o Genkit.
enableFirebaseTelemetry();

// Inicializa o Genkit com o plugin Vertex AI.
const ai = genkit({
  plugins: [
    vertexAI({location: "us-central1"}),
  ],
});

// Define o fluxo de sugestão de menu.
const menuSuggestionFlow = ai.defineFlow(
  {
    name: "menuSuggestionFlow",
    inputSchema: z.string()
      .describe("Um tema de restaurante")
      .default("seafood"),
    outputSchema: z.string(),
    streamSchema: z.string(),
  },
  async function(subject: string, {sendChunk}: { sendChunk: (chunk: string) => void }) {
    // Constrói o prompt para o modelo de IA.
    const prompt = `Sugira um item para o menu de um restaurante com tema ${subject}`;

    // Gera uma resposta de streaming do modelo de IA.
    const {response, stream} = await ai.generateStream({ // Adicionado await aqui
      model: gemini20Flash,
      prompt,
      config: {temperature: 1},
    });

    // Transmite os "pedaços" de texto da resposta da IA.
    for await (const chunk of stream) {
      sendChunk(chunk.text);
    }

    // Retorna o texto completo da resposta da IA.
    return (await response).text;
  }
);

// Exporta a função invocável do Firebase para o fluxo Genkit.
export const menuSuggestion = onCallGenkit(
  {
    // enforceAppCheck: true, // Descomente se precisar forçar o App Check
    secrets: [apiKey],
  },
  menuSuggestionFlow,
);
