import { useState, useEffect } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Check, Sparkles, Send, RefreshCw } from "lucide-react";
import { cn } from "../../lib/utils";

export const CreateQuestionFlow = ({ onBack, onSubmit }) => {
    const [step, setStep] = useState("ask");
    const [question, setQuestion] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [displayMessages, setDisplayMessages] = useState([
        {
            id: "bot-init",
            content: "Hello! I'm your AI assistant. What's on your mind? I'll help you post your question anonymously. 🔒",
            isAI: true,
            timestamp: new Date()
        }
    ]);

    const handleMessage = async (message) => {
        if (step === "ask") {
            const userMsg = {
                id: Date.now().toString(),
                content: message,
                isOwn: true,
                timestamp: new Date()
            };
            setDisplayMessages(prev => [...prev, userMsg]);
            setQuestion(message);
            setIsAnalyzing(true);

            // Simulate AI analysis
            setTimeout(() => {
                setIsAnalyzing(false);
                setStep("confirm");
                const aiResponse = {
                    id: "bot-confirm",
                    content: `That's a great question! I've prepared it for anonymous posting. Ready to share it with the community?`,
                    isAI: true,
                    timestamp: new Date()
                };
                setDisplayMessages(prev => [...prev, aiResponse]);
            }, 1500);

        } else if (step === "confirm") {
            if (message.toLowerCase().includes("yes") || message.toLowerCase().includes("post") || message.toLowerCase().includes("ok")) {
                handlePost();
            } else {
                setStep("ask");
                setQuestion("");
                setDisplayMessages([
                    {
                        id: "bot-reset",
                        content: "No problem! Let's try again. What's your new question? 📝",
                        isAI: true,
                        timestamp: new Date()
                    }
                ]);
            }
        }
    };

    const handlePost = () => {
        setStep("done");
        const doneMsg = {
            id: "bot-done",
            content: "Blast off! 🚀 Your question is now live and completely anonymous.",
            isAI: true,
            timestamp: new Date()
        };
        setDisplayMessages(prev => [...prev, doneMsg]);

        setTimeout(() => {
            onSubmit(question);
        }, 2000);
    };

    return (
        <div className="flex flex-col h-full bg-background">
            <ChatHeader title="Post Question" subtitle="Helper" showBack onBack={onBack} />

            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
                {displayMessages.map((msg) => (
                    <ChatMessage
                        key={msg.id}
                        id={msg.id}
                        content={msg.content}
                        userId={msg.isAI ? "ai-assistant" : "current-user"}
                        timestamp={msg.timestamp}
                        isAI={msg.isAI}
                        isOwn={msg.isOwn}
                    />
                ))}

                {isAnalyzing && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse px-2">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span>AI is analyzing your question...</span>
                    </div>
                )}

                {step === "confirm" && !isAnalyzing && (
                    <div className="mx-2 flex flex-col gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                        <p className="text-[11px] font-bold text-primary uppercase tracking-widest">Preview</p>
                        <p className="text-[13px] text-foreground/90 leading-relaxed italic">"{question}"</p>
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={handlePost}
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold uppercase tracking-wide hover:opacity-90 transition-all shadow-glow"
                            >
                                <Send className="w-3.5 h-3.5" />
                                Post Now
                            </button>
                            <button
                                onClick={() => {
                                    setStep("ask");
                                    setQuestion("");
                                    setDisplayMessages(prev => [...prev.slice(0, -2)]);
                                }}
                                className="px-3 py-2 bg-secondary text-foreground rounded-lg text-xs font-semibold hover:bg-secondary/80 transition-all"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                )}

                {step === "done" && (
                    <div className="flex justify-center py-8">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center shadow-glow animate-bounce">
                                <Check className="w-8 h-8 text-primary-foreground" />
                            </div>
                            <p className="text-sm text-muted-foreground animate-pulse">Redirecting to thread...</p>
                        </div>
                    </div>
                )}

                <div id="anchor" className="h-4" />
            </div>

            <ChatInput
                placeholder={
                    step === "ask"
                        ? "What's your question?"
                        : step === "confirm"
                            ? "Type 'yes' or click Post Now"
                            : "Posting..."
                }
                onSend={handleMessage}
                disabled={step === "done" || isAnalyzing}
            />
        </div>
    );
};
