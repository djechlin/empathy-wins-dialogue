export const deepgramAgentConfig = {
    audio: {
        input: {
            encoding: 'linear16',
            sample_rate: 24000,
        },
        output: {
            encoding: 'linear16',
            sample_rate: 24000,
            container: 'none',
        },
    },
    agent: {
        language: 'en',
        listen: {
            provider: {
                type: 'deepgram',
                model: 'nova-3',
            },
        },
        think: {
            provider: {
                type: 'open_ai',
                model: 'gpt-4o-mini',
            },
            prompt: 'You are a friendly AI assistant for practicing dialogue skills.',
        },
        speak: {
            provider: {
                type: 'deepgram',
                model: 'aura-2-thalia-en',
            },
        },
        greeting: 'Hello! I\'m here to help you practice your dialogue skills. How can I assist you today?',
    },
} as const;