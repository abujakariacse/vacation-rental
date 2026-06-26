import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import ScrollToTop from "./ScrollToTop.jsx";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,          // Data is fresh for 30s
      refetchOnWindowFocus: true,     // Refetch when user returns to tab
      refetchOnMount: true,           // Refetch when component mounts
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <QueryClientProvider client={queryClient}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              borderRadius: "12px",
              padding: "12px 16px",
            },
            success: {
              iconTheme: { primary: "#F43F5E", secondary: "#fff" },
            },
          }}
        />
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
