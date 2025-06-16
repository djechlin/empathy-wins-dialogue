# README

## Side project ideas

- Try adapting the whole stack to a related challenge, like interviews, challenges at work, conflict at home, or sales. Note this space has competitors such as Yoodli, but it's not clear to me any competitor has pressed the "active listening" direction.
- Try throwing the whole app in CrewAI or similar. Meaning, the user, voter, report generator can all be automated. Maybe you can demonstrate the user agent successfully learning from the feedback provided by the feedback agent.
- So far I've found I'm constantly writing content and doing frontend design/engineering simultaneously. Ideally we'd be able to prompt AI not just for a blog post but for a whole lesson page, or a report page. Can we try building out the "content infra" layer?

More philosophical:

- Learn more about the psychology of persuasion. I recommend _Conspicuous Cognition_ Substack.
- Ask the question: when do humans _want_ to be in the loop? Is it the case that people like persuading, but don't much care if they're persuaded by a human? Is having a bunch of AI bot friends acceptable? Is the point of a human just proof-of-effort?

## Tech stack

### App

- Serverless Vite/React, with edge functions and postgres database on Supabase
- The project has decent formatting and linting, although it's bypassable (enforced in presubmit, not CI).
- Deployed by Lovable
- For vibe coding I use Lovable and Claude Code mostly, plus Cursor.
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

## Cost management

My biggest expense right now is vibe coding, about $300/month. My second biggest expense will be the voice provider at about $0.50 per roleplay session, or text AI if the use is really intensive.

The easiest way to blow money in AI coding is just to call AI either in a loop or with a large context. I mainly deal with this by having low credits in all my accounts. The downside is, getting 400s for "out of money" is frequent.

If you're collaborating with me, I recommend covering your own vibe coding costs, using my Supabase endpoints but switching to your own ChatGPT or Claude API key as needed, and using my Hume.ai credits.

## Cost management and AI keys

- I mostly manage cos

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/b9c6b9ef-6be4-4852-970e-f7f321bdad57

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b9c6b9ef-6be4-4852-970e-f7f321bdad57) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/b9c6b9ef-6be4-4852-970e-f7f321bdad57) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
