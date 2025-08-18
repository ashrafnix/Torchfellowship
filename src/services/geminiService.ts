
export const getAIResponseStream = async (history: any, newMessage: string): Promise<ReadableStream<Uint8Array> | null> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("Authentication token not found.");
        }

        const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ history, newMessage }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to get AI response: ${response.status} ${errorText}`);
        }
        
        return response.body;
    } catch (error) {
        console.error("Error fetching AI stream:", error);
        return null;
    }
};
