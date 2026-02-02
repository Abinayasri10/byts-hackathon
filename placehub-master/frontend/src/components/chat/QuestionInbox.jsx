import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { QuestionCard } from "./QuestionCard";
import { ChatHeader } from "./ChatHeader";
import { cn } from "../../lib/utils";

export const QuestionInbox = ({
    questions,
    onSelectQuestion,
    onCreateQuestion,
    selectedId,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const filteredQuestions = questions.filter((q) => {
        const matchesSearch = (q.text || q.question || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "all" || q.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex flex-col h-full">
            <ChatHeader title="AnonQ Chat" subtitle="Ask anything anonymously" />

            {/* Search & Filters */}
            <div className="p-4 space-y-3 border-b border-border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={cn(
                            "w-full pl-9 pr-4 py-2 rounded-lg",
                            "bg-input border border-border",
                            "text-sm text-foreground placeholder:text-muted-foreground",
                            "focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40",
                            "transition-all"
                        )}
                    />
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                    {["all", "open", "archived"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={cn(
                                "px-2.5 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap capitalize",
                                filterStatus === status
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Question List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2">
                {filteredQuestions.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No questions found</p>
                    </div>
                ) : (
                    filteredQuestions.map((question) => (
                        <QuestionCard
                            key={question._id || question.id}
                            question={question.text || question.question}
                            answerCount={question.answerCount || 0}
                            status={question.status}
                            lastActivity={question.createdAt || question.lastActivity}
                            onClick={() => onSelectQuestion(question._id || question.id)}
                            isSelected={selectedId === (question._id || question.id)}
                        />
                    ))
                )}
            </div>

            {/* Create Question Button */}
            <div className="p-3 border-t border-border">
                <button
                    onClick={onCreateQuestion}
                    className={cn(
                        "w-full flex items-center justify-center gap-2",
                        "py-2 rounded-xl text-sm font-semibold",
                        "bg-chat-background text-chat-foreground",
                        "hover:opacity-90 active:scale-[0.98]",
                        "transition-all duration-200",
                        "shadow-glow"
                    )}
                >
                    <Plus className="w-4 h-4" />
                    Ask a Question
                </button>
            </div>
        </div>
    );
};
