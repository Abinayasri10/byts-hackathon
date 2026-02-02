import { MessageCircle, Clock } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { cn } from "../../lib/utils";

export const QuestionCard = ({
    question,
    answerCount,
    status,
    lastActivity,
    onClick,
    isSelected,
}) => {
    const formatTimeAgo = (date) => {
        if (!date) return "Just now";
        const d = new Date(date);
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return "Just now";
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full text-left p-4 rounded-lg transition-all duration-200",
                "hover:bg-secondary/50 active:scale-[0.99]",
                "border border-transparent",
                isSelected
                    ? "bg-secondary border-primary/30 shadow-glow"
                    : "bg-card hover:border-border"
            )}
        >
            <div className="flex items-start justify-between gap-3 mb-1.5">
                <h3 className="text-sm font-medium text-foreground line-clamp-2 flex-1 leading-snug">
                    {question}
                </h3>
                <StatusBadge status={status} className="scale-75 origin-top-right shrink-0" />
            </div>

            <div className="flex items-center gap-4 text-[12px] text-muted-foreground mt-auto">
                <div className="flex items-center gap-1.5 min-w-0">
                    <MessageCircle className="w-4 h-4 shrink-0 opacity-70" />
                    <span className="truncate">
                        {(answerCount || 0)} {(answerCount === 1) ? "response" : "responses"}
                    </span>
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                    <Clock className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    <span className="truncate">{formatTimeAgo(lastActivity)}</span>
                </div>
            </div>
        </button>
    );
};
