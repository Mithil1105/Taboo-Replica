import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OfflineBanner } from "@/components/common/OfflineBanner";
import { PWAUpdatePrompt } from "@/components/common/PWAUpdatePrompt";
import Home from "./pages/landing/Home";
import HowToPlay from "./pages/landing/HowToPlay";
import GameModes from "./pages/landing/GameModes";
import About from "./pages/landing/About";
import FAQ from "./pages/landing/FAQ";
import Contact from "./pages/landing/Contact";
import Play from "./pages/Play";
import NotFound from "./pages/NotFound";

const PassAndPlay = lazy(() => import("@/features/game/pass-and-play/pages/PassAndPlay"));
const LocalMultiplayerIntro = lazy(() => import("@/features/game/local-multiplayer/pages/Intro"));
const LocalMultiplayerCreateRoom = lazy(() => import("@/features/game/local-multiplayer/pages/CreateRoom"));
const LocalMultiplayerJoinRoom = lazy(() => import("@/features/game/local-multiplayer/pages/JoinRoom"));
const LocalMultiplayerLobby = lazy(() => import("@/features/game/local-multiplayer/pages/Lobby"));

const PageFallback = () => (
  <div className="flex min-h-svh items-center justify-center bg-background">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner position="bottom-center" />
      <PWAUpdatePrompt />
      <OfflineBanner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-to-play" element={<HowToPlay />} />
          <Route path="/game-modes" element={<GameModes />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/play" element={<Play />} />
          <Route path="/play/pass-and-play" element={<Suspense fallback={<PageFallback />}><PassAndPlay /></Suspense>} />
          <Route path="/play/local-multiplayer" element={<Suspense fallback={<PageFallback />}><LocalMultiplayerIntro /></Suspense>} />
          <Route path="/play/local-multiplayer/create" element={<Suspense fallback={<PageFallback />}><LocalMultiplayerCreateRoom /></Suspense>} />
          <Route path="/play/local-multiplayer/join" element={<Suspense fallback={<PageFallback />}><LocalMultiplayerJoinRoom /></Suspense>} />
          <Route path="/play/local-multiplayer/room/:roomCode" element={<Suspense fallback={<PageFallback />}><LocalMultiplayerLobby /></Suspense>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
