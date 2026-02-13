import dotenv from "dotenv";
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

dotenv.config();

export const client = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY)
);

export const embeddingDeployment =
  process.env.AZURE_EMBEDDING_DEPLOYMENT || "text-embedding-3-large";

export const llmDeployment =
  process.env.AZURE_LLM_DEPLOYMENT || "gpt-5";
