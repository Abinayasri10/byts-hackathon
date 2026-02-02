import { useRef, useEffect } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { AISummaryPanel } from "./AISummaryPanel";

export const ChatThread = ({
    question,
    messages,
    aiSummary,
    activeUsers,
    onBack,
    onSendMessage,
    onReact,
    onArchive,
    onReport,
}) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const isArchived = question?.status === "archived";

    return (
        <div className="flex flex-col h-full">
            <ChatHeader
                title={question?.text || question?.question}
                status={question?.status}
                showBack
                onBack={onBack}
                activeUsers={activeUsers}
                onArchive={!isArchived ? onArchive : undefined}
                onReport={onReport}
            />

            {/* AI Summary */}
            {aiSummary && (
                <AISummaryPanel
                    summary={aiSummary.summary}
                    keyPoints={aiSummary.keyPoints}
                    isLoading={aiSummary.isLoading}
                />
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-none p-4 space-y-4">
                {messages.map((message) => (
                    <ChatMessage
                        key={message._id || message.id}
                        content={message.text || message.content}
                        imageUrl={message.imageUrl}
                        userId={message.senderIcon || message.userId}
                        timestamp={message.createdAt || message.timestamp}
                        isOwn={message.isOwn}
                        isAI={message.isAI}
                        reactions={message.reactions}
                        userReactions={message.userReactions}
                        onReact={onReact ? (type) => onReact(message._id || message.id, type) : undefined}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <ChatInput
                placeholder={isArchived ? "This question is archived" : "Share your response..."}
                onSend={onSendMessage}
                disabled={isArchived}
            />
        </div>
    );
};
