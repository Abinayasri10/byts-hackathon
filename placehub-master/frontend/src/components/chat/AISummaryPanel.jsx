import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";

export const AISummaryPanel = ({ summary, keyPoints = [], isLoading }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    if (!summary && !isLoading) return null;

    return (
        <div className="mx-4 mb-4">
            <div
                className={cn(
                    "bg-message-ai/30 border border-message-ai/30 rounded-lg overflow-hidden",
                    "transition-all duration-300"
                )}
            >
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between p-3 hover:bg-message-ai/20 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-message-ai/50">
                            <Sparkles className="w-4 h-4 text-purple-300" />
                        </div>
                        <span className="text-sm font-medium text-purple-200">AI Summary</span>
                    </div>
                    {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                </button>

                {isExpanded && (
                    <div className="px-4 pb-4 animate-fade-in">
                        {isLoading ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                                <span>Generating summary...</span>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm text-foreground/90 leading-relaxed mb-3">
                                    {summary}
                                </p>
                                {keyPoints.length > 0 && (
                                    <ul className="space-y-1">
                                        {keyPoints.map((point, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start gap-2 text-sm text-muted-foreground"
                                            >
                                                <span className="text-purple-400 mt-0.5">•</span>
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
