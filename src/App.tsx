import { Toaster as Sonner } from '@/ui/sonner';
import { Toaster } from '@/ui/toaster';
import { TooltipProvider } from '@/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import About from './pages/About';
import Auth from './pages/Auth';
import ChallengeLayout from './components/layout/ChallengeLayout';
import Blog from './pages/Blog';
import CognitiveDissonance from './pages/blog/CognitiveDissonance';
import SwingVoters from './pages/blog/SwingVoters';
import TheNameType2Dialogue from './pages/blog/TheNameType2Dialogue';
import TurningOutTheBase from './pages/blog/TurningOutTheBase';
import Index from './pages/Index';
import Learn from './pages/Learn';
import LearnChapter from './pages/LearnChapter';
import NotFound from './pages/NotFound';
import Prepare from './pages/Prepare';
import Privacy from './pages/Privacy';
import Report from './pages/Report';
import Roleplay from './pages/Roleplay';
import StartingOut from './pages/StartingOut';
import Text from './pages/Text';
import RallyFollowup from './pages/RallyFollowup';
import Workbench from './pages/Workbench';
import WorkbenchDemo from './pages/WorkbenchDemo';
import WorkbenchChats from './pages/WorkbenchChats';
import Relational from './pages/Relational';
import PromptsHistory from './pages/PromptsHistory';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/starting-out" element={<StartingOut />} />
            <Route path="/learn/:chapterId" element={<LearnChapter />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/the-name-type2dialogue" element={<TheNameType2Dialogue />} />
            <Route path="/blog/cognitive-dissonance" element={<CognitiveDissonance />} />
            <Route path="/blog/swing-voters" element={<SwingVoters />} />
            <Route path="/blog/turning-out-the-base" element={<TurningOutTheBase />} />
            <Route path="/challenge" element={<ChallengeLayout />}>
              <Route index element={<Navigate to="/challenge/prepare" replace />} />
              <Route path="prepare" element={<Prepare />} />
              <Route path="roleplay" element={<Roleplay />} />
              <Route path="competencies" element={<Report />} />
            </Route>
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/text" element={<Text />} />
            <Route path="/rally-followup" element={<RallyFollowup />} />
            <Route path="/workbench" element={<Workbench />} />
            <Route path="/workbench/demo" element={<WorkbenchDemo />} />
            <Route path="/workbench/chats" element={<WorkbenchChats />} />
            <Route path="/relational" element={<Relational />} />
            <Route path="/prompts/history" element={<PromptsHistory />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
