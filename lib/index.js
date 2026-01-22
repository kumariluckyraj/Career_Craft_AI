import { callOllama } from "./ollama";
import { callOpenAI } from "./openai";

// Toggle this to true to test OpenAI locally
const FORCE_OPENAI = true;

export async function callAI(prompt) {
  if (!FORCE_OPENAI && process.env.NODE_ENV === "development") {
    return callOllama(prompt);
  }
  return callOpenAI(prompt);
}
