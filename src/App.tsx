import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HistoryPage from "./pages/HistoryPage";
import EbooksPage from "./pages/EbooksPage";

// Calculator Pages
import DripCalculatorPage from "./pages/calculators/DripCalculatorPage";
import DilutionCalculatorPage from "./pages/calculators/DilutionCalculatorPage";
import FluidBalanceCalculatorPage from "./pages/calculators/FluidBalanceCalculatorPage";
import IMCCalculatorPage from "./pages/calculators/IMCCalculatorPage";
import OxygenCalculatorPage from "./pages/calculators/OxygenCalculatorPage";
import InsulinCalculatorPage from "./pages/calculators/InsulinCalculatorPage";
import HeparinCalculatorPage from "./pages/calculators/HeparinCalculatorPage";
import DPPCalculatorPage from "./pages/calculators/DPPCalculatorPage";
import GlasgowCalculatorPage from "./pages/calculators/GlasgowCalculatorPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/historico" element={<HistoryPage />} />
            <Route path="/ebooks" element={<EbooksPage />} />
            
            {/* Calculator Routes */}
            <Route path="/calculadoras/gotejamento" element={<DripCalculatorPage />} />
            <Route path="/calculadoras/diluicao" element={<DilutionCalculatorPage />} />
            <Route path="/calculadoras/balanco-hidrico" element={<FluidBalanceCalculatorPage />} />
            <Route path="/calculadoras/imc" element={<IMCCalculatorPage />} />
            <Route path="/calculadoras/oxigenio" element={<OxygenCalculatorPage />} />
            <Route path="/calculadoras/insulina" element={<InsulinCalculatorPage />} />
            <Route path="/calculadoras/heparina" element={<HeparinCalculatorPage />} />
            <Route path="/calculadoras/dpp" element={<DPPCalculatorPage />} />
            <Route path="/calculadoras/glasgow" element={<GlasgowCalculatorPage />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
