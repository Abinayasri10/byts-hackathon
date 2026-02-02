import { ArrowLeft, MoreVertical, Users, Archive, Flag, Link, Check } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { cn } from "../../lib/utils";
import { useState, useRef, useEffect } from "react";

export const ChatHeader = ({
    title = "AnonQ Chat",
    subtitle,
    status,
    onBack,
    showBack = false,
    activeUsers,
    onArchive,
    onReport,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            setIsMenuOpen(false);
        }, 1500);
    };

    return (
        <div className="relative flex items-center gap-3 p-4 border-b border-border bg-card/80 backdrop-blur-sm z-30">
            {showBack && (
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
            )}

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h1 className="text-sm font-semibold text-foreground truncate tracking-tight">{title}</h1>
                    {status && <StatusBadge status={status} />}
                </div>
                {subtitle && (
                    <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
                )}
            </div>

            <div className="flex items-center gap-2">
                {activeUsers !== undefined && activeUsers > 0 && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-status-open/20 text-status-open">
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{activeUsers}</span>
                    </div>
                )}

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={cn(
                            "p-2 rounded-lg hover:bg-secondary transition-colors",
                            isMenuOpen && "bg-secondary text-primary"
                        )}
                    >
                        <MoreVertical className="w-5 h-5" />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl py-1.5 animate-in fade-in zoom-in-95 duration-100 z-50">
                            {onArchive && (
                                <button
                                    onClick={() => {
                                        onArchive();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                                >
                                    <Archive className="w-4 h-4 text-muted-foreground" />
                                    Archive Question
                                </button>
                            )}

                            <button
                                onClick={handleCopyLink}
                                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                            >
                                {copied ? (
                                    <Check className="w-4 h-4 text-status-open" />
                                ) : (
                                    <Link className="w-4 h-4 text-muted-foreground" />
                                )}
                                {copied ? "Copied!" : "Copy URL"}
                            </button>

                            <div className="my-1 border-t border-border" />

                            <button
                                onClick={() => {
                                    onReport?.();
                                    setIsMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                            >
                                <Flag className="w-4 h-4" />
                                Report Question
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
