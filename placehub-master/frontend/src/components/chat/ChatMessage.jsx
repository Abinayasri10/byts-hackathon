import { cn } from "../../lib/utils";
import { AnimalAvatar, getAnimalName } from "./AnimalAvatar";
import { ReactionGroup } from "./ReactionButton";

export const ChatMessage = ({
    content,
    imageUrl,
    userId,
    timestamp,
    isOwn = false,
    isAI = false,
    reactions,
    userReactions,
    onReact,
}) => {
    const formatTime = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div
            className={cn(
                "flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300",
                isOwn ? "flex-row-reverse" : "flex-row"
            )}
        >
            {!isOwn && (
                <div className="mt-auto mb-1 shrink-0">
                    <AnimalAvatar seed={isAI ? "ai-assistant" : userId} size="sm" />
                </div>
            )}

            <div className={cn("max-w-[85%] flex flex-col group", isOwn ? "items-end" : "items-start")}>
                <div
                    className={cn(
                        "relative px-3 py-1.5 shadow-sm min-w-[60px]",
                        isOwn
                            ? "bg-secondary text-secondary-foreground rounded-[18px] rounded-br-none"
                            : isAI
                                ? "bg-accent/10 border border-accent/20 text-foreground rounded-[18px] rounded-bl-none"
                                : "bg-card text-card-foreground border border-border/50 rounded-[18px] rounded-bl-none"
                    )}
                >
                    {!isOwn && (
                        <span className={cn(
                            "text-[11px] font-bold mb-0.5 block truncate",
                            isAI ? "text-accent" : "text-secondary"
                        )}>
                            {isAI ? "Helper" : `Anonymous ${getAnimalName(userId)}`}
                        </span>
                    )}

                    <div className="flex flex-col gap-2">
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt="Shared image"
                                className="max-w-full rounded-lg h-auto max-h-[250px] object-contain bg-black/5"
                            />
                        )}
                        <div className="flex flex-wrap items-end gap-2">
                            {content && (
                                <p className="text-[13.5px] leading-relaxed flex-1 break-words">
                                    {content}
                                </p>
                            )}
                            <div className="flex items-center gap-1 mt-0.5 ml-auto">
                                <span className="text-[10px] text-muted-primary italic tabular-nums">
                                    {formatTime(timestamp)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {reactions && !isOwn && (
                    <div className="mt-1 transition-opacity">
                        <ReactionGroup
                            reactions={reactions}
                            userReactions={userReactions}
                            onReact={onReact}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
