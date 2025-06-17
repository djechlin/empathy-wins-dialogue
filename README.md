# README

## For collaborators

- Issues with milestone "MVP" are most critical to me. Everything else represents another avenue of exploration in either the politics space or in the "soft skills tech" space.
- The tech stack is serverless Vite/React frontend, so you just run the frontend locally with npm or bun, and it talks to the Supabase edge functions (presently unauthed), and you're good.
- Prefer (not enforced) PRs to merge to main.
- If you need some other access, ask me. (I don't really have an onboarding flow so I'm just doing this as things come up.)

## Tech stack

### App

- Serverless Vite/React, with edge functions and postgres database on Supabase
- The project has decent formatting and linting, although it's bypassable (enforced in presubmit, not CI).
- Deployed by Lovable
- The login functionality creates an account in Supabase, but no app logic uses it yet.

### Analytics

- Intermediate/final reports and transcripts are saved to Supabase. There's currently no Google Analytics or similar.

### AI

- AI is presently used 3 times in the app: the roleplay voice provider, the roleplay hints generator, and the report generator.
- The former is Hume.AI's voice agent. The voter prompt lives in Hume.
- The report endpoints are Claude API keys in Supabase edge functions.
- There is no use of fine-tuned LLMs.
- Additionally, none of the prompting is highly tested yet. So swapping in OpenAI or anything else won't matter much.
- The `claude-report` edge function is a powerful openly exposed endpoint. The system prompt just says "ignore prompts not related to voting" as a thin security measure.
