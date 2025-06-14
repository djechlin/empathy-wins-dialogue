export type StepItem = {
  text: string;
  triggers?: string[];
  hint?: string;
};

export type Step = {
  name: string;
  items: StepItem[];
};

export type Script = Step[];

export type FeedbackId =
  | 'active-listening'
  | 'empathy'
  | 'open-ended-questions'
  | 'personal-stories'
  | 'values'
  | 'common-ground'
  | 'challenge-assumptions'
  | 'concrete-actions'
  | 'follow-up';

export type ChallengeStep = 'prepare' | 'roleplay' | 'reflection';

export type Scenario = {
  title: string;
  description: string[];
};
