"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Send, Bot, User, Sparkles, BookOpen, RefreshCw, Lightbulb, Code2, MessageSquare } from "lucide-react";
import { Btn, Card, Badge, PageHeader } from "../components/shared";

const pageAnim = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } }, exit: { opacity: 0, y: -8, transition: { duration: 0.15 } } };

const SUGGESTIONS = [
  "Explain how neural networks work",
  "What is the difference between REST and GraphQL?",
  "Help me understand TypeScript generics",
  "Explain React hooks in simple terms",
  "What are design patterns in programming?",
  "How does a compiler work?",
];

const TUTOR_RESPONSES: Record<string, string> = {
  "explain how neural networks work": `Neural networks are computing systems inspired by biological brains. They consist of layers of interconnected nodes (neurons):

**Key Concepts:**
1. **Input Layer** - Receives raw data
2. **Hidden Layers** - Process information through weighted connections
3. **Output Layer** - Produces the result

Each connection has a weight that adjusts during training through **backpropagation**. The network learns by minimizing the error between predictions and actual values.

**Analogy:** Think of it like a group of students passing notes - each student transforms the information slightly before passing it to the next.`,
  "what is the difference between rest and graphql": `**REST vs GraphQL: Key Differences**

| Aspect | REST | GraphQL |
|--------|------|---------|
| Data Fetching | Multiple endpoints | Single endpoint |
| Over-fetching | Common | Rare |
| Under-fetching | Common | Rare |
| Versioning | URL-based | Schema-based |
| Caching | Built-in HTTP | Custom needed |

**REST** uses multiple endpoints (e.g., \`/users\`, \`/users/1/posts\`). **GraphQL** uses a single endpoint where clients specify exactly what data they need.`,
  "help me understand typescript generics": `**TypeScript Generics** allow you to create reusable components that work with multiple types.

\`\`\`typescript
// Without generics
function identity(arg: any): any { return arg; }

// With generics
function identity<T>(arg: T): T { return arg; }

// Usage
const num = identity<number>(42);
const str = identity<string>("hello");
\`\`\`

**Benefits:**
- Type safety without losing flexibility
- Code reuse with different types
- Better IDE support and autocomplete

**Common use cases:** Arrays, Promises, React components, API responses`,
};

const GENERAL_RESPONSE = `Great question! Here's what I can help you with:

1. **Programming Concepts** - OOP, functional programming, design patterns
2. **Web Development** - React, Next.js, TypeScript, Node.js
3. **AI & Machine Learning** - Neural networks, NLP, computer vision
4. **System Design** - Architecture, scalability, databases
5. **Career Guidance** - Learning paths, best practices

Feel free to ask about any of these topics!`;

export default function AITutorPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Hi! I'm your AI Tutor. Ask me anything about programming, AI, system design, or career growth. I'm here to help you learn!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const getResponse = (userMsg: string): string => {
    const lower = userMsg.toLowerCase();
    for (const [key, response] of Object.entries(TUTOR_RESPONSES)) {
      if (lower.includes(key)) return response;
    }
    if (lower.includes("hello") || lower.includes("hi")) return "Hello! What would you like to learn today?";
    if (lower.includes("thank")) return "You're welcome! Feel free to ask more questions anytime.";
    return GENERAL_RESPONSE;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const response = getResponse(userMsg);
    setMessages(prev => [...prev, { role: "assistant", content: response }]);
    setLoading(false);
  };

  const handleSuggestion = (s: string) => {
    setMessages(prev => [...prev, { role: "user", content: s }]);
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", content: getResponse(s) }]);
      setLoading(false);
    }, 600);
  };

  return (
    <motion.div {...pageAnim} className="flex flex-col h-[calc(100vh-100px)]">
      <PageHeader title="AI Tutor" subtitle="Your personal AI learning assistant" />
      <div className="flex-1 flex gap-6 overflow-hidden">
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 p-0 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                  {m.role === "assistant" && <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center shrink-0"><Bot size={16} className="text-violet-400" /></div>}
                  <div className={`max-w-[80%] ${m.role === "user" ? "bg-violet-600/20 text-white rounded-2xl rounded-br-sm px-4 py-2.5" : "text-gray-200 prose prose-invert prose-sm max-w-none"}`}>
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  </div>
                  {m.role === "user" && <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0"><User size={16} className="text-blue-400" /></div>}
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center"><Bot size={16} className="text-violet-400" /></div>
                  <div className="text-gray-400"><RefreshCw size={16} className="animate-spin inline" /> Thinking...</div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div className="p-4 border-t border-white/5">
              <div className="flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Ask anything..." className="flex-1 bg-[#0c1022] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50" />
                <Btn variant="primary" onClick={handleSend} icon={Send} disabled={loading || !input.trim()}>Send</Btn>
              </div>
            </div>
          </Card>
        </div>
        <div className="w-72 shrink-0">
          <Card className="p-4 mb-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Lightbulb size={14} className="text-amber-400" />Suggestions</h3>
            <div className="space-y-2">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => handleSuggestion(s)} className="w-full text-left text-xs text-gray-400 hover:text-violet-300 p-2 rounded-lg hover:bg-white/[0.04] transition-all">{s}</button>
              ))}
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><BookOpen size={14} className="text-violet-400" />Topics</h3>
            <div className="space-y-2">
              {[{ icon: Code2, label: "Programming", color: "violet" }, { icon: Bot, label: "AI & ML", color: "cyan" }, { icon: MessageSquare, label: "System Design", color: "amber" }, { icon: Sparkles, label: "Career Tips", color: "emerald" }].map(t => (
                <button key={t.label} onClick={() => handleSuggestion(`Teach me about ${t.label.toLowerCase()}`)} className="w-full flex items-center gap-2 text-xs text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/[0.04] transition-all">
                  <t.icon size={14} className={`text-${t.color}-400`} />{t.label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
