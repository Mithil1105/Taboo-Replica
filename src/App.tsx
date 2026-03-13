import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "./pages/landing/Home";
import HowToPlay from "./pages/landing/HowToPlay";
import GameModes from "./pages/landing/GameModes";
import About from "./pages/landing/About";
import FAQ from "./pages/landing/FAQ";
import Contact from "./pages/landing/Contact";
import Play from "./pages/Play";
import NotFound from "./pages/NotFound";
import PassAndPlay from "@/features/game/pass-and-play/pages/PassAndPlay";
import LocalMultiplayerIntro from "@/features/game/local-multiplayer/pages/Intro";
import LocalMultiplayerCreateRoom from "@/features/game/local-multiplayer/pages/CreateRoom";
import LocalMultiplayerJoinRoom from "@/features/game/local-multiplayer/pages/JoinRoom";
import LocalMultiplayerLobby from "@/features/game/local-multiplayer/pages/Lobby";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-to-play" element={<HowToPlay />} />
          <Route path="/game-modes" element={<GameModes />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/play" element={<Play />} />
          <Route path="/play/pass-and-play" element={<PassAndPlay />} />
          <Route path="/play/local-multiplayer" element={<LocalMultiplayerIntro />} />
          <Route path="/play/local-multiplayer/create" element={<LocalMultiplayerCreateRoom />} />
          <Route path="/play/local-multiplayer/join" element={<LocalMultiplayerJoinRoom />} />
          <Route path="/play/local-multiplayer/room/:roomCode" element={<LocalMultiplayerLobby />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
