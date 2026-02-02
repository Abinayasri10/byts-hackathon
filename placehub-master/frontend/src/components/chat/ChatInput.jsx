import { Send, ImagePlus, X, Paperclip } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "../../lib/utils";

export const ChatInput = ({
    placeholder = "Type a message...",
    onSend,
    disabled,
}) => {
    const [message, setMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSend = () => {
        const hasContent = message.trim() || selectedImage;
        if (hasContent && !disabled) {
            onSend(message.trim(), selectedImage);
            setMessage("");
            setSelectedImage(null);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="p-3 border-t border-border bg-card/50 backdrop-blur-sm">
            {/* Image Preview */}
            {selectedImage && (
                <div className="mb-3 relative inline-block group">
                    <img
                        src={selectedImage}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded-lg border border-border shadow-sm"
                    />
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            )}

            <div className="flex items-end gap-2">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled}
                    className="p-2.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground"
                >
                    <Paperclip className="w-5 h-5" />
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </button>

                <div className="flex-1 relative">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={disabled}
                        rows={1}
                        className={cn(
                            "w-full px-4 py-2.5 rounded-2xl resize-none",
                            "bg-input border border-border/50",
                            "text-[14px] text-foreground placeholder:text-muted-foreground/60",
                            "focus:outline-none focus:ring-1 focus:ring-primary/30",
                            "transition-all duration-200",
                            "min-h-[40px] max-h-[120px]",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                        style={{ height: "40px" }}
                        onInput={(e) => {
                            const target = e.target;
                            target.style.height = "40px";
                            target.style.height = Math.min(target.scrollHeight, 120) + "px";
                        }}
                    />
                </div>

                <button
                    onClick={handleSend}
                    disabled={(!message.trim() && !selectedImage) || disabled}
                    className={cn(
                        "p-2.5 rounded-full transition-all duration-200",
                        "bg-primary text-primary-foreground",
                        "hover:opacity-90 active:scale-90",
                        "disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100",
                        (message.trim() || selectedImage) && !disabled && "shadow-glow group"
                    )}
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
