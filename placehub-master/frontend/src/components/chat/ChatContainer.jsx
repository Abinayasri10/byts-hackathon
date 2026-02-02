import { useState, useEffect, useRef } from "react";
import { QuestionInbox } from "./QuestionInbox";
import { ChatThread } from "./ChatThread";
import { CreateQuestionFlow } from "./CreateQuestionFlow";
import { cn } from "../../lib/utils";
import { questionService, answerService, sessionService } from "../../services/api";

const ANIMALS = ["🦊", "🐼", "🦁", "🐨", "🦉", "🐸", "🦋", "🐙", "🦜", "🐢", "🦈", "🐝"];

export const ChatContainer = ({ className }) => {
    const [view, setView] = useState("inbox");
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [messages, setMessages] = useState([]);
    const [sessionIcon, setSessionIcon] = useState("");
    const socketRef = useRef(null);

    useEffect(() => {
        // Generate a session icon and ID if not exists
        let icon = localStorage.getItem('anonq_session_icon');
        let sId = localStorage.getItem('anonq_session_id');

        if (!icon) {
            icon = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
            localStorage.setItem('anonq_session_icon', icon);
        }
        if (!sId) {
            sId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('anonq_session_id', sId);
        }

        setSessionIcon(icon);

        // Init session on backend
        sessionService.init({
            sessionId: sId,
            animalIcon: icon
        }).catch(err => console.error("Session init failed", err));

        fetchQuestions();

        // Setup WebSocket
        const socket = new WebSocket('ws://localhost:5000');
        socket.onopen = () => console.log('WebSocket Connected');
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'ANSWER_RECEIVED') {
                const answer = data.payload;
                if (answer.questionId === selectedQuestionId) {
                    setMessages(prev => [...prev, answer]);
                }
                setQuestions(prev => prev.map(q => {
                    const qId = q._id || q.id;
                    return (qId === answer.questionId)
                        ? { ...q, answerCount: (q.answerCount || 0) + 1 }
                        : q;
                }));
            }
            if (data.type === 'REACTION_UPDATED') {
                const { answerId, reactions } = data.payload;
                setMessages(prev => prev.map(m =>
                    (m._id === answerId) ? { ...m, reactions } : m
                ));
            }
        };
        socketRef.current = socket;

        return () => socket.close();
    }, [selectedQuestionId]);

    const fetchQuestions = async () => {
        try {
            const res = await questionService.getQuestions();
            setQuestions(res.data);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    const fetchAnswers = async (qId) => {
        try {
            const res = await answerService.getAnswers(qId);
            setMessages(res.data);
        } catch (error) {
            console.error("Error fetching answers:", error);
        }
    };

    const handleSelectQuestion = (id) => {
        setSelectedQuestionId(id);
        fetchAnswers(id);
        setView("thread");
    };

    const handleBack = () => {
        setView("inbox");
        setSelectedQuestionId(null);
        setMessages([]);
        fetchQuestions();
    };

    const handleCreateQuestion = () => {
        setView("create");
    };

    const handleSubmitQuestion = async (questionText) => {
        try {
            const res = await questionService.createQuestion(
                questionText,
                localStorage.getItem('anonq_session_id')
            );
            const newQuestion = res.data;
            setQuestions([newQuestion, ...questions]);
            setSelectedQuestionId(newQuestion._id);
            setMessages([]);
            setView("thread");
        } catch (error) {
            console.error("Error creating question:", error);
        }
    };

    const handleSendMessage = (content, imageUrl) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: 'NEW_ANSWER',
                payload: {
                    questionId: selectedQuestionId,
                    text: content,
                    senderIcon: sessionIcon,
                    sessionId: localStorage.getItem('anonq_session_id'),
                    imageUrl
                }
            }));
        }
    };

    const handleReact = (answerId, type) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: 'REACTION',
                payload: {
                    answerId,
                    reaction: type // 'helpful', 'clear', or 'smart'
                }
            }));
        }
    };

    const handleArchive = async (questionId) => {
        try {
            await questionService.updateStatus(questionId, 'archived');
            setQuestions(prev => prev.map(q =>
                (q._id === questionId) ? { ...q, status: 'archived' } : q
            ));
        } catch (error) {
            console.error("Error archiving question:", error);
        }
    };

    const handleReport = (questionId) => {
        // Implementation for reporting (could be another API call)
        alert("Thank you for reporting. Our moderators will review this question shortly. 🔒");
    };

    const selectedQuestion = questions.find((q) => (q._id || q.id) === selectedQuestionId);

    return (
        <div
            className={cn(
                "w-[80vw] sm:w-[350px] h-[100dvh] sm:h-[min(600px,calc(100vh-120px))]",
                "bg-background sm:border border-border",
                "sm:rounded-2xl overflow-hidden shadow-soft",
                "flex flex-col",
                className
            )}
        >
            {view === "inbox" && (
                <QuestionInbox
                    questions={questions}
                    onSelectQuestion={handleSelectQuestion}
                    onCreateQuestion={handleCreateQuestion}
                    selectedId={selectedQuestionId}
                />
            )}

            {view === "thread" && selectedQuestion && (
                <ChatThread
                    question={selectedQuestion}
                    messages={messages.map(m => ({ ...m, isOwn: m.senderIcon === sessionIcon }))}
                    aiSummary={selectedQuestion.aiSummary ? { summary: selectedQuestion.aiSummary, keyPoints: [] } : undefined}
                    onBack={handleBack}
                    onSendMessage={handleSendMessage}
                    onReact={handleReact}
                    onArchive={() => handleArchive(selectedQuestion._id)}
                    onReport={() => handleReport(selectedQuestion._id)}
                />
            )}

            {view === "create" && (
                <CreateQuestionFlow onBack={handleBack} onSubmit={handleSubmitQuestion} />
            )}
        </div>
    );
};

export default ChatContainer;
