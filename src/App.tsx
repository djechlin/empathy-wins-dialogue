
import { Toaster } from "@/ui/toaster";
import { Toaster as Sonner } from "@/ui/sonner";
import { TooltipProvider } from "@/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Learn from "./pages/Learn";
import StartingOut from "./pages/StartingOut";
import LearnChapter from "./pages/LearnChapter";
import Blog from "./pages/Blog";
import CognitiveDissonance from "./pages/blog/CognitiveDissonance";
import SwingVoters from "./pages/blog/SwingVoters";
import TurningOutTheBase from "./pages/blog/TurningOutTheBase";
import TheNameType2Dialogue from "./pages/blog/TheNameType2Dialogue";
import Auth from "./pages/Auth";
import Challenge from "./pages/Challenge";
import NotFound from "./pages/NotFound";

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
          <Route path="/challenge" element={<Challenge />} />
          <Route path="/auth" element={<Auth />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
