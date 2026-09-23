import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Bot,
  User,
  X,
  Sparkles,
  Volume2,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  Globe,
  Loader2,
  Languages
} from "lucide-react";

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  languageDetected?: string;
}

interface SafeUpiAiChatProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: string;
}

const MULTILINGUAL_STARTER_PROMPTS = [
  {
    lang: "Telugu (తెలుగు)",
    query: "డబ్బులు రావడానికి యూపీఐ పిన్ (UPI PIN) ఎంటర్ చేయాలా?",
    badge: "TE"
  },
  {
    lang: "Hindi (हिन्दी)",
    query: "क्या मुझे लॉटरी या कैशबैक पाने के लिए UPI PIN दर्ज करना चाहिए?",
    badge: "HI"
  },
  {
    lang: "English",
    query: "Someone asked me to install AnyDesk to verify KYC. Is this safe?",
    badge: "EN"
  },
  {
    lang: "Telugu (తెలుగు)",
    query: "మోసపూరిత లావాదేవీ జరిగితే 1930 హెల్ప్‌లైన్ కి ఎలా ఫిర్యాదు చేయాలి?",
    badge: "TE"
  },
  {
    lang: "Hindi (हिन्दी)",
    query: "OLX बायर ने कलेक्ट रिक्वेस्ट भेजी है, क्या मुझे स्वीकार करना चाहिए?",
    badge: "HI"
  },
  {
    lang: "Tamil (தமிழ்)",
    query: "பணம் பெற UPI PIN போட வேண்டுமா? இது உண்மையா?",
    badge: "TA"
  },
  {
    lang: "English",
    query: "How does SafeUPI detect fake QR codes and collect request scams?",
    badge: "EN"
  }
];

export const SafeUpiAiChat: React.FC<SafeUpiAiChatProps> = ({
  isOpen,
  onClose,
  currentLang = "en"
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "👋 Namaste! I am your SafeUPI Smart AI Assistant.\n\n🌐 You can ask me questions in ANY language—English, Telugu (తెలుగు), Hindi (हिन्दी), Tamil (தமிழ்), Kannada, Marathi, etc. I will automatically respond in your language!\n\nAsk me about suspicious UPI IDs, collect request scams, screen sharing risks, or how to freeze stolen funds via the 1930 helpline.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMsgId,
        sender: "user",
        text: textToSend,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ];

    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          currentLang,
          history: newMessages.slice(-6).map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text
          }))
        })
      });

      const data = await response.json();
      const botReply = data.reply || "I am here to protect your transactions. Please feel free to ask your question.";

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          languageDetected: data.detectedLanguage
        }
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: "⚠️ Connection note: Remember that receiving money NEVER requires entering your UPI PIN! If you suspect fraud, call the National Cyber Crime Helpline at 1930 immediately.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const speakText = (text: string, id: string) => {
    if (!window.speechSynthesis) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Simple regional speech detection
    if (/[\u0C00-\u0C7F]/.test(text)) {
      utterance.lang = "te-IN";
    } else if (/[\u0900-\u097F]/.test(text)) {
      utterance.lang = "hi-IN";
    } else if (/[\u0B80-\u0BFF]/.test(text)) {
      utterance.lang = "ta-IN";
    } else {
      utterance.lang = "en-IN";
    }

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl h-[88vh] max-h-[720px] shadow-2xl flex flex-col overflow-hidden text-slate-900 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Deep Navy & Electric Blue */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-900/30">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">SafeUPI AI Assistant</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/30 text-sky-300 border border-blue-400/40 flex items-center gap-1">
                  <Languages className="w-3 h-3 text-sky-300" />
                  Multilingual
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Ask in Telugu, Hindi, Tamil, English, or any Indian language
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setMessages([
                  {
                    id: `welcome-${Date.now()}`,
                    sender: "bot",
                    text: "Conversation reset. Feel free to ask any question in English, Telugu (తెలుగు), Hindi (हिन्दी), or any regional language!",
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  }
                ]);
              }}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
              title="Reset Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Clean Light Notice Banner */}
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 flex items-center justify-between text-xs text-blue-900 shrink-0">
          <span className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span><strong>Smart Regional Language Support:</strong> Ask in Telugu, Hindi, English, etc. — AI replies in that language.</span>
          </span>
          <span className="hidden sm:inline text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
            Helpline: 1930
          </span>
        </div>

        {/* Message Container - Clean Light Background */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? "bg-blue-600 text-white rounded-tr-xs"
                      : "bg-white border border-slate-200 text-slate-800 rounded-tl-xs"
                  }`}
                >
                  <div className="whitespace-pre-line break-words font-normal">
                    {msg.text}
                  </div>

                  <div className={`mt-2.5 pt-2 border-t flex items-center justify-between gap-3 text-[10px] ${
                    isUser ? "border-blue-500 text-blue-100" : "border-slate-100 text-slate-400"
                  }`}>
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => speakText(msg.text, msg.id)}
                          className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer transition-colors"
                          title="Read aloud in regional speech"
                        >
                          <Volume2 className={`w-3.5 h-3.5 ${speakingId === msg.id ? "text-blue-600 animate-pulse" : ""}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(msg.text, msg.id)}
                          className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer transition-colors"
                          title="Copy message"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-4 text-xs text-slate-600 flex items-center gap-2 shadow-xs">
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                <span>AI is analyzing your query in your language...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Popular Security Questions:</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {MULTILINGUAL_STARTER_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(item.query)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs text-slate-700 hover:text-blue-800 whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span className="text-[10px] font-bold px-1 rounded bg-blue-100 text-blue-700">
                  {item.badge}
                </span>
                <span>{item.query}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your question in English, Telugu (తెలుగు), Hindi (हिन्दी)..."
            className="flex-1 bg-slate-50 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-xs transition-all cursor-pointer shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4 ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
