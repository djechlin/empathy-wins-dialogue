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
  | 'framing-introduced-your-name'
  | 'framing-named-issue-plainspoken'
  | 'framed-uplifting'
  | 'listened-asked-about-relationship'
  | 'listened-dug-deeper'
  | 'listened-shared-own-relationship'
  | 'listened-got-vulnerable'
  | 'explored-connected-issue'
  | 'explored-stayed-calm'
  | 'call-voter-interested'
  | 'call-voter-called';

export type ChallengeStep = 'framing' | 'listening' | 'exploring' | 'calling';

export type Scenario = {
  title: string;
  description: string[];
};
