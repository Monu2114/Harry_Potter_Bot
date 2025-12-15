"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";

export default function Page() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });
  const [input, setInput] = useState("");
  return (
    <div className="bg-teal-50 h-fit">
      <img
        className="h-screen w-screen absolute opacity-60"
        src="https://www.hogwartslegacy.com/images/share.jpg"
      ></img>
      <div className="p-12 flex flex-col">
        <h1 className="text-5xl font-bold text-center cursive">
          𝑾𝑬𝑳𝑪𝑶𝑴𝑬 𝑻𝑶 𝑯𝑶𝑮𝑾𝑨𝑹𝑻𝑺
        </h1>
        <div className="border-black border-3 rounded-xl mt-12 p-8 w-1/4 flex flex-col absolute min-h-56">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-2 rounded-xl ${
                message.role === "user" ? "bg-gray-400" : "bg-teal-200"
              } w-fit mb-6`}
            >
              {message.parts.map((part, index) => (
                <span key={index} className={`p-2 rounded-xl`}>
                  {part.text}
                </span>
              ))}
            </div>
          ))}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) {
                sendMessage({ text: input });
                setInput("");
              }
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={status !== "ready"}
              placeholder="Adagara chari..."
              className="bg-gray-200 rounded-full w-4/5 p-2 mr-4"
            />
            <button
              type="submit"
              disabled={status !== "ready"}
              className="text-2xl"
            >
              ➤
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
