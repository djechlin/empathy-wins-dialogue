
export type StepItem = {
    text: string;
    triggers?: string[];
    hint?: string;
}

export type Step = {
    name: string;
    items: StepItem[];
};

export type Script = Step[];

export type ScenarioId =
| 'deep-canvassing'
| 'law-order-voter'
| 'code-review-junior-feedback'
| 'intro-canvassing'
| 'busy-voter-libraries'
| 'empathetic-listening'
| 'love-list';

export type Scenario = {
    title: string;
    description: string[];
};

export type ChallengeId = 'healthcare'|'climate'|'lgbt'|'voting';

export type Challenge = {
    id: ChallengeId;
    title: string;
    voterAction?: string;
    humePersona?: string
    disabled?: boolean;
    script?: Script;
}
