import { convertToModelMessages, streamText, UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";

// Allow streaming responses up to 30 seconds
function extractTextFromParts(parts) {
  return parts
    .map((part) => {
      if (Array.isArray(part.text)) {
        return part.text.join("");
      }
      return part.text ?? "";
    })
    .join("");
}

export const maxDuration = 30;
export async function POST(req) {
  const supabaseClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );
  const { messages } = await req.json();

  const lastMessage = messages[messages.length - 1];

  const query = extractTextFromParts(lastMessage.parts);

  console.log("QUERY:", query, typeof query);

  const res = await fetch("http://localhost:8000/embed", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: query }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error("Embedding API failed: " + err);
  }

  const embedding = await res.json();

  const { data, error } = await supabaseClient.rpc("match_documents", {
    query_embedding: embedding,
    match_threshold: 0.5,
    match_count: 10,
  });
  console.log("RPC DATA:", data);
  console.log("RPC ERROR:", error);
  const context = data.map((row) => row.content).join("\n\n");

  const result = streamText({
    model: "deepseek/deepseek-v3.1",
    system: `You are a harry potter assistant u should answer only the harry potter related to questions from the context given. If don't know the answer reply Idk ${context}`,
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
