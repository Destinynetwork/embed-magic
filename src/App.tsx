import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { RequireAdmin } from "@/components/auth/RequireAdmin";
import { RequireFreeAuth } from "@/components/auth/RequireFreeAuth";
import { RequirePro } from "@/components/auth/RequirePro";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFreeEmbeds from "./pages/admin/AdminFreeEmbeds";
import AdminProAssets from "./pages/admin/AdminProAssets";
import AdminUsers from "./pages/admin/AdminUsers";
import SignUp from "./pages/SignUp";
import Pricing from "./pages/Pricing";
import DemoPage from "./pages/DemoPage";
import Dashboard from "./pages/Dashboard";
import EmbedPro from "./pages/EmbedPro";
import EmbedProHub from "./pages/EmbedProHub";
import FreeDashboard from "./pages/free/FreeDashboard";
import FreeAddEmbed from "./pages/free/FreeAddEmbed";
import FreeMyEmbeds from "./pages/free/FreeMyEmbeds";
import ProDashboard from "./pages/pro/ProDashboard";
import ProUploadVideo from "./pages/pro/ProUploadVideo";
import ProMyAssets from "./pages/pro/ProMyAssets";
import Upgrade from "./pages/Upgrade";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/auth" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/embed-pro" element={<EmbedPro />} />
            <Route path="/embed-pro-hub" element={<EmbedProHub />} />
            {/* Free tier routes */}
            <Route path="/free" element={<RequireFreeAuth><FreeDashboard /></RequireFreeAuth>} />
            <Route path="/free/add" element={<RequireFreeAuth><FreeAddEmbed /></RequireFreeAuth>} />
            <Route path="/free/embeds" element={<RequireFreeAuth><FreeMyEmbeds /></RequireFreeAuth>} />
            {/* Pro tier routes */}
            <Route path="/pro" element={<RequirePro><ProDashboard /></RequirePro>} />
            <Route path="/pro/upload" element={<RequirePro><ProUploadVideo /></RequirePro>} />
            <Route path="/pro/assets" element={<RequirePro><ProMyAssets /></RequirePro>} />
            {/* Upgrade page */}
            <Route path="/upgrade" element={<Upgrade />} />
            <Route path="/admin" element={<RequireAuth><RequireAdmin><AdminDashboard /></RequireAdmin></RequireAuth>} />
            <Route path="/admin/dashboard" element={<RequireAuth><RequireAdmin><AdminDashboard /></RequireAdmin></RequireAuth>} />
            <Route path="/admin/free-embeds" element={<RequireAuth><RequireAdmin><AdminFreeEmbeds /></RequireAdmin></RequireAuth>} />
            <Route path="/admin/pro-assets" element={<RequireAuth><RequireAdmin><AdminProAssets /></RequireAdmin></RequireAuth>} />
            <Route path="/admin/users" element={<RequireAuth><RequireAdmin><AdminUsers /></RequireAdmin></RequireAuth>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
