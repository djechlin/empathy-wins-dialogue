import { Toaster as Sonner } from '@/ui/sonner';
import { Toaster } from '@/ui/toaster';
import { TooltipProvider } from '@/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth';
import Blog from './pages/Blog';
import CognitiveDissonance from './pages/blog/CognitiveDissonance';
import SwingVoters from './pages/blog/SwingVoters';
import TheNameType2Dialogue from './pages/blog/TheNameType2Dialogue';
import TurningOutTheBase from './pages/blog/TurningOutTheBase';
import ChallengePage from './pages/ChallengePage';
import Index from './pages/Index';
import Learn from './pages/Learn';
import LearnChapter from './pages/LearnChapter';
import NotFound from './pages/NotFound';
import Preparation from './pages/Preparation';
import Report from './pages/Report';
import Roleplay from './pages/Roleplay';
import StartingOut from './pages/StartingOut';

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
            <Route path="/challenge" element={<ChallengePage />} />
            <Route path="/preparation" element={<Preparation />} />
            <Route path="/report" element={<Report />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/roleplay" element={<Roleplay />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
