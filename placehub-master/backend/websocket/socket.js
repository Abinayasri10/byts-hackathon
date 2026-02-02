import { WebSocketServer } from 'ws';
import Answer from '../models/Answer.js';

export default function setupWebSocket(server) {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        console.log('Client connected via WebSocket');

        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message.toString());
                console.log('Received message:', data);

                if (data.type === 'NEW_ANSWER') {
                    const { questionId, text, senderIcon, imageUrl, sessionId } = data.payload;

                    const answer = new Answer({
                        questionId,
                        text,
                        senderIcon,
                        imageUrl,
                        sessionId
                    });

                    await answer.save();

                    const broadcastData = JSON.stringify({
                        type: 'ANSWER_RECEIVED',
                        payload: answer,
                    });

                    wss.clients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(broadcastData);
                        }
                    });
                }

                if (data.type === 'REACTION') {
                    const { answerId, reaction } = data.payload;
                    const answer = await Answer.findById(answerId);

                    if (answer) {
                        const reactions = answer.reactions ?? new Map();
                        const currentCount = reactions.get(reaction) || 0;

                        reactions.set(reaction, currentCount + 1);
                        answer.reactions = reactions;
                        await answer.save();

                        const broadcastData = JSON.stringify({
                            type: 'REACTION_UPDATED',
                            payload: {
                                answerId,
                                reactions: Object.fromEntries(answer.reactions),
                                triggeredBy: reaction,
                                timestamp: Date.now()
                            },
                        });

                        wss.clients.forEach((client) => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(broadcastData);
                            }
                        });
                    }
                }
            } catch (error) {
                console.error('WebSocket message error:', error);
            }
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    return wss;
}
