import { MessageCircle, X } from "lucide-react";
import { cn } from "../../lib/utils";

export const ChatWidgetButton = ({ isOpen, onToggle, notificationCount = 0 }) => {
    return (
        <button
            onClick={onToggle}
            className={cn(
                "fixed bottom-6 right-6 z-50",
                "w-14 h-14 rounded-full",
                "flex items-center justify-center",
                "transition-all duration-300",
                "shadow-soft hover:shadow-glow",
                isOpen
                    ? "bg-secondary rotate-0"
                    : "bg-primary animate-pulse-glow"
            )}
        >
            {isOpen ? (
                <X className="w-6 h-6 text-foreground" />
            ) : (
                <>
                    <MessageCircle className="w-6 h-6 text-primary-foreground" />
                    {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center">
                            {notificationCount > 9 ? "9+" : notificationCount}
                        </span>
                    )}
                </>
            )}
        </button>
    );
};

export default ChatWidgetButton;
