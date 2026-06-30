"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Play, Copy, Check, RefreshCw, Terminal, Code2, Download } from "lucide-react";
import { Btn, Card, Badge, PageHeader } from "../components/shared";
import { mediaService } from "@/services/media";

const pageAnim = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } }, exit: { opacity: 0, y: -8, transition: { duration: 0.15 } } };

const LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
];

const SNIPPETS: Record<string, string> = {
  javascript: `// JavaScript Playground
function greet(name) {
  return \`Hello, \${name}! Welcome to Code Playground.\`;
}

console.log(greet("Developer"));

// Try some array operations
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

// Arrow functions & destructuring
const user = { name: "Alice", role: "Engineer" };
const { name, role } = user;
console.log(\`\${name} is an \${role}\`);
`,
  typescript: `// TypeScript Playground
interface User {
  name: string;
  age: number;
  role: "admin" | "user" | "viewer";
}

function createUser(name: string, age: number, role: User["role"]): User {
  return { name, age, role };
}

const admin = createUser("Admin", 30, "admin");
console.log(admin);

// Generic function
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const first = firstElement([1, 2, 3]);
console.log("First element:", first);
`,
  python: `# Python Playground
def fibonacci(n):
    """Generate Fibonacci sequence up to n terms."""
    a, b = 0, 1
    result = []
    for _ in range(n):
        result.append(a)
        a, b = b, a + b
    return result

print("Fibonacci:", fibonacci(10))

# List comprehension
squares = [x**2 for x in range(1, 11)]
print("Squares:", squares)

# Dictionary operations
data = {"name": "Python", "type": "language", "year": 1991}
for key, value in data.items():
    print(f"{key}: {value}")
`,
  html: `<!DOCTYPE html>
<html>
<head>
  <title>Preview</title>
  <style>
    body { font-family: system-ui; padding: 2rem; background: #0f0f1a; color: white; }
    .card { background: #1a1a2e; border-radius: 12px; padding: 1.5rem; margin: 1rem 0; }
    h1 { color: #8b5cf6; }
    button { background: #8b5cf6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello, World!</h1>
    <p>This is HTML preview in Code Playground.</p>
    <button onclick="alert('Clicked!')">Click Me</button>
  </div>
</body>
</html>
`,
  css: `/* CSS Playground */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 2rem;
  background: linear-gradient(135deg, #0f0f1a, #1a1a2e);
  min-height: 100vh;
}

.card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.15);
}

.title { color: #8b5cf6; font-size: 1.25rem; font-weight: bold; }
.text { color: #94a3b8; font-size: 0.875rem; }
`,
};

export default function CodePlaygroundPage() {
  const [lang, setLang] = useState("javascript");
  const [code, setCode] = useState(SNIPPETS["javascript"]);
  const [output, setOutput] = useState("");
  const [executing, setExecuting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLangChange = (l: string) => {
    setLang(l);
    setCode(SNIPPETS[l] || "");
    setOutput("");
  };

  const handleRun = async () => {
    setExecuting(true);
    setOutput("");
    try {
      if (lang === "html") {
        const blob = new Blob([code], { type: "text/html" });
        setOutput(`[Preview available in HTML mode]\n${code.substring(0, 200)}...`);
      } else {
        const result = await mediaService.code.execute({ language: lang, code });
        setOutput(result.output || "Execution completed.\n");
      }
    } catch (e: any) {
      setOutput(`Error: ${e.message || "Execution failed"}\n`);
    }
    setExecuting(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCode(SNIPPETS[lang] || "");
    setOutput("");
  };

  return (
    <motion.div {...pageAnim} className="h-[calc(100vh-100px)] flex flex-col">
      <PageHeader title="Code Playground" subtitle="Write, run, and test code in your browser"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-[#0c1022] rounded-lg p-1 border border-white/[0.05]">
              {LANGUAGES.map(l => (
                <button key={l.id} onClick={() => handleLangChange(l.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${lang === l.id ? "bg-violet-600/25 text-violet-300" : "text-gray-500 hover:text-gray-300"}`}
                >{l.label}</button>
              ))}
            </div>
          </div>
        }
      />
      <div className="flex-1 grid md:grid-cols-2 gap-4 min-h-0">
        <Card className="p-0 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-white/5 flex items-center justify-between bg-[#0c1022]">
            <span className="text-xs text-gray-500 font-mono">{lang.toUpperCase()}</span>
            <div className="flex gap-1">
              <button onClick={handleCopy} className="p-1.5 text-gray-500 hover:text-white rounded transition-colors" title="Copy">{copied ? <Check size={14} /> : <Copy size={14} />}</button>
              <button onClick={handleReset} className="p-1.5 text-gray-500 hover:text-white rounded transition-colors" title="Reset"><RefreshCw size={14} /></button>
            </div>
          </div>
          <textarea value={code} onChange={e => setCode(e.target.value)} className="flex-1 w-full bg-[#060814] text-green-400 font-mono text-sm p-4 focus:outline-none resize-none" style={{ tabSize: 2 }} spellCheck={false} />
          <div className="p-2 border-t border-white/5 flex items-center justify-between bg-[#0c1022]">
            <span className="text-xs text-gray-500">{code.split("\n").length} lines</span>
            <Btn variant="primary" size="sm" icon={Play} onClick={handleRun} loading={executing}>Run</Btn>
          </div>
        </Card>
        <Card className="p-0 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-white/5 flex items-center gap-2 bg-[#0c1022]">
            <Terminal size={14} className="text-violet-400" />
            <span className="text-xs font-medium text-white">Output</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
            {output ? (
              <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="text-gray-600 flex flex-col items-center justify-center h-full">
                <Code2 size={32} className="mb-2 opacity-30" />
                <p className="text-xs">Write code and click Run to see output</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
