import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Portfolio from "./pages/Portfolio";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./components/AdminDashboard";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  { path: "/", element: <Portfolio /> },
  { path: "/admin", element: <AdminDashboard /> },
  { path: "*", element: <NotFound /> },
]);
const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <RouterProvider 
      router={router}
      future={{ v7_startTransition: true }}
    />
  </QueryClientProvider>
);

export default App;
