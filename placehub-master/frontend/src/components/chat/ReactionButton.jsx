import { ThumbsUp, Heart, Flame } from "lucide-react";
import { cn } from "../../lib/utils";

const reactionConfig = {
    helpful: { icon: ThumbsUp, label: "Helpful", className: "hover:bg-reaction-helpful/20" },
    clear: { icon: Heart, label: "Clear", className: "hover:bg-reaction-clear/20" },
    smart: { icon: Flame, label: "Smart", className: "hover:bg-reaction-smart/20" },
};

export const ReactionButton = ({ type, count, active, onClick }) => {
    const config = reactionConfig[type];
    const Icon = config.icon;

    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-1.2 px-2 py-0.8 rounded-full text-[10px] font-medium transition-all",
                "bg-secondary/40 border border-transparent hover:scale-105 active:scale-95",
                config.className,
                active && "ring-1 ring-primary/40 border-primary/20 bg-primary/10"
            )}
            title={config.label}
        >
            <Icon className={cn("w-3 h-3", active ? "text-primary" : "text-muted-foreground")} />
            {count >= 0 && (
                <span
                    key={count}
                    className={cn(
                        "animate-in fade-in zoom-in duration-300",
                        active ? "text-primary font-bold" : "text-muted-foreground"
                    )}
                >
                    {count}
                </span>
            )}
        </button>
    );
};

export const ReactionGroup = ({ reactions, userReactions = [], onReact }) => {
    return (
        <div className="flex gap-1 mt-2">
            <ReactionButton
                type="helpful"
                count={reactions?.helpful || 0}
                active={userReactions.includes("helpful")}
                onClick={() => onReact?.("helpful")}
            />
            <ReactionButton
                type="clear"
                count={reactions?.clear || 0}
                active={userReactions.includes("clear")}
                onClick={() => onReact?.("clear")}
            />
            <ReactionButton
                type="smart"
                count={reactions?.smart || 0}
                active={userReactions.includes("smart")}
                onClick={() => onReact?.("smart")}
            />
        </div>
    );
};
