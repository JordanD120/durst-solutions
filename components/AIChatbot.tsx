"use client";

import { useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";

type Message = {
  role: "bot" | "user";
  text: string;
};

function getReply(input: string) {
  const message = input.toLowerCase();

  if (message.includes("website")) {
    return "I can help with modern website redesigns, contact forms, mobile layouts, SEO basics, and Vercel deployment.";
  }

  if (message.includes("automation")) {
    return "Automation can help with spreadsheets, emails, forms, reporting, lead tracking, and repetitive business workflows.";
  }

  if (message.includes("ai") || message.includes("chatbot")) {
    return "AI solutions can include chatbots, lead qualification, document assistants, website audits, and internal knowledge tools.";
  }

  if (message.includes("price") || message.includes("cost")) {
    return "Pricing depends on the scope. The best first step is a free website audit or consultation.";
  }

  return "Durst Solutions helps businesses with modern websites, automation, and practical AI tools. What are you trying to improve?";
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hi, I’m the Durst Solutions demo assistant. Ask me about websites, automation, or AI tools.",
    },
  ]);

  function sendMessage() {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((current) => [
      ...current,
      { role: "user", text: userMessage },
      { role: "bot", text: getReply(userMessage) },
    ]);
    setInput("");
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/30 transition hover:scale-105"
        aria-label="Open chatbot"
      >
        <MessageCircle />
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600">
                <Bot size={19} />
              </div>
              <div>
                <p className="font-bold">Durst AI Demo</p>
                <p className="text-xs text-slate-400">Frontend prototype</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chatbot">
              <X size={20} />
            </button>
          </div>

          <div className="max-h-80 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.text}-${index}`}
                className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "bot"
                    ? "bg-white/5 text-slate-200"
                    : "ml-auto bg-blue-600 text-white"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="flex gap-2 border-t border-white/10 p-4">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendMessage();
              }}
              className="flex-1 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-cyan-300"
              placeholder="Ask a question..."
            />
            <button
              onClick={sendMessage}
              className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 transition hover:bg-blue-500"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}