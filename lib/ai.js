import { callOllama } from "./ollama";
import { callHuggingFace } from "./gm";

export async function callAI(prompt) {
  if (process.env.NODE_ENV === "development") {
    return callOllama(prompt);
  }

  return callHuggingFace(prompt);
}