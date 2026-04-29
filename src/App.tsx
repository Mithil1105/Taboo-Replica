import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { SEOStructuredData } from "@/components/landing/SEOStructuredData";
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
import TermsOfService from "./pages/landing/TermsOfService";
import PrivacyPolicy from "./pages/landing/PrivacyPolicy";
import CookiePolicy from "./pages/landing/CookiePolicy";
import Play from "./pages/Play";
import NotFound from "./pages/NotFound";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/lib/auth/AuthProvider";

const PassAndPlay = lazy(() => import("@/features/game/pass-and-play/pages/PassAndPlay"));
const LocalMultiplayerIntro = lazy(() => import("@/features/game/local-multiplayer/pages/Intro"));
const LocalMultiplayerCreateRoom = lazy(() => import("@/features/game/local-multiplayer/pages/CreateRoom"));
const LocalMultiplayerJoinRoom = lazy(() => import("@/features/game/local-multiplayer/pages/JoinRoom"));
const LocalMultiplayerLobby = lazy(() => import("@/features/game/local-multiplayer/pages/Lobby"));
const Login = lazy(() => import("./pages/auth/Login"));
const AuthCallback = lazy(() => import("./pages/auth/AuthCallback"));
const SuperAdminLayout = lazy(() => import("@/components/admin/SuperAdminLayout").then((m) => ({ default: m.SuperAdminLayout })));
const SuperAdminOverview = lazy(() => import("./pages/admin/SuperAdminOverview"));
const SuperAdminRoles = lazy(() => import("./pages/admin/SuperAdminRoles"));
const SuperAdminFriends = lazy(() => import("./pages/admin/SuperAdminFriends"));
const SuperAdminPayments = lazy(() => import("./pages/admin/SuperAdminPayments"));

const PageFallback = () => (
  <div className="flex min-h-svh items-center justify-center bg-background">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Sonner position="bottom-center" />
          <PWAUpdatePrompt />
          <OfflineBanner />
          <BrowserRouter>
            <ScrollToTop />
            <SEOStructuredData />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/how-to-play" element={<HowToPlay />} />
              <Route path="/game-modes" element={<GameModes />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/play" element={<Play />} />
              <Route path="/play/pass-and-play" element={<Suspense fallback={<PageFallback />}><PassAndPlay /></Suspense>} />
              <Route path="/play/local-multiplayer" element={<Suspense fallback={<PageFallback />}><LocalMultiplayerIntro /></Suspense>} />
              <Route path="/play/local-multiplayer/create" element={<Suspense fallback={<PageFallback />}><LocalMultiplayerCreateRoom /></Suspense>} />
              <Route path="/play/local-multiplayer/join" element={<Suspense fallback={<PageFallback />}><LocalMultiplayerJoinRoom /></Suspense>} />
              <Route path="/play/local-multiplayer/room/:roomCode" element={<Suspense fallback={<PageFallback />}><LocalMultiplayerLobby /></Suspense>} />
              <Route path="/login" element={<Suspense fallback={<PageFallback />}><Login /></Suspense>} />
              <Route path="/auth/callback" element={<Suspense fallback={<PageFallback />}><AuthCallback /></Suspense>} />
              <Route path="/super-admin" element={<Suspense fallback={<PageFallback />}><SuperAdminLayout /></Suspense>}>
                <Route index element={<Suspense fallback={<PageFallback />}><SuperAdminOverview /></Suspense>} />
                <Route path="roles" element={<Suspense fallback={<PageFallback />}><SuperAdminRoles /></Suspense>} />
                <Route path="friends" element={<Suspense fallback={<PageFallback />}><SuperAdminFriends /></Suspense>} />
                <Route path="payments" element={<Suspense fallback={<PageFallback />}><SuperAdminPayments /></Suspense>} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
