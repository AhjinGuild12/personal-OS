
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Task } from '../types';

interface BrainViewProps {
  tasks: Task[];
}

const BrainView: React.FC<BrainViewProps> = ({ tasks }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const modelName = 'gemini-3-flash-preview';
      
      const context = `
        You are the Brain of a Neo-Brutalist Personal OS. 
        Current User Tasks: ${JSON.stringify(tasks.map(t => ({ title: t.title, done: t.completed })))}.
        User Question: ${userMsg}
        Keep your response punchy, bold, and helpful. Use a "cool OS" persona.
      `;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: context,
      });

      const aiText = response.text || "I'm experiencing a neural lag. Try again?";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Critical error in cerebral cortex. Check console." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="p-6 bg-[#e07a5f] neo-border shadow-neo">
        <h2 className="text-3xl font-heading font-black text-white">AI Cerebral Cortex</h2>
        <p className="font-bold text-white/80">Neural network active. Analyzing ${tasks.length} data points.</p>
      </div>

      <div className="flex-1 flex flex-col min-h-[500px] bg-white neo-border shadow-neo overflow-hidden">
        <div 
          ref={scrollRef}
          className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5"
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-20 h-20 neo-border bg-[#f2cc8f] rounded-full flex items-center justify-center animate-pulse shadow-neo">
                 <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/></svg>
              </div>
              <p className="font-heading font-black text-xl">System Idle. Awaiting commands.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                <button onClick={() => setInput("Summarize my day")} className="p-2 neo-border text-xs font-bold hover:bg-black hover:text-white transition-colors">"Summarize my day"</button>
                <button onClick={() => setInput("What should I prioritize?")} className="p-2 neo-border text-xs font-bold hover:bg-black hover:text-white transition-colors">"Prioritize tasks"</button>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`max-w-[80%] p-4 neo-border shadow-neo-sm ${
                msg.role === 'user' 
                  ? 'ml-auto bg-[#81b29a] font-bold' 
                  : 'mr-auto bg-white font-medium'
              }`}
            >
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div className="mr-auto p-4 neo-border bg-white italic font-bold animate-pulse">
              Thinking...
            </div>
          )}
        </div>

        <div className="p-4 border-t-4 border-black bg-[#fdf6e3] flex gap-4">
          <input 
            type="text" 
            className="flex-1 px-4 py-2 neo-border bg-white outline-none font-bold"
            placeholder="Ask the Brain..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage}
            disabled={isTyping}
            className="px-6 py-2 neo-border bg-black text-white font-heading font-black shadow-neo-sm neo-transition disabled:opacity-50"
          >
            EXECUTE
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrainView;
