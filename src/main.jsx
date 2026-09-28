import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import SplashScreen from "./components/SplashScreen.jsx";
import "./styles/globals.css";

/**
 * Opt in to the v7 behaviours now so the upgrade is a version bump, not a
 * surprise. `v7_startTransition` wraps route state updates in a transition,
 * which is what keeps the splash and reveal animations from blocking paint on
 * the first navigation.
 */
const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

const root = document.getElementById("root");

createRoot(root).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL} future={routerFuture}>
      <SplashScreen />
      <App />
    </BrowserRouter>
  </StrictMode>
);
