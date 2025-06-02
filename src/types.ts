
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


const feedback = {
    'framing': ['frameHowTheIssueAffectsPeoplePositively', 'useSimpleLanguageNotJargon'],
    'listening': ['digDeeper', 'shareYourLovedOne', 'dontBeJudgmental', 'askHowTheIssueAffectsThem'],
    'exploring': ['reflectTheirMostInterestingWords', 'noLecturing']
};

export type FeedbackId =
'bright-side' | 'direct-language' | 'no-jargon' | 'no-filler' | 'share-your-loved-one'
| 'why-you-love-them' | 'a-moment-in-time' | 'ask-how-the-issue-affects-them' | 'dont-be-judgmental' |
'ask-about-their-loved-ones' | 'dig-deeper' | 'dont-ruin-it-with-politics' | 'ask-questions' |
'tie-it-in-to-our-loved-ones' | 'reflection' | 'no-lecturing';

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
