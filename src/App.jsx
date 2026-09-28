import { Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import MobileCallBar from "./components/MobileCallBar.jsx";
import ScrollManager from "./components/ScrollManager.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Home from "./pages/Home.jsx";

import NotFound from "./pages/NotFound.jsx";
import Irrigation from "./pages/Irrigation.jsx";
import Products from "./pages/Products.jsx";
import Applications from "./pages/Applications.jsx";
import Projects from "./pages/Projects.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

export default function App() {
  const location = useLocation();

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>

      <Navbar />

      <ScrollManager />

      <ErrorBoundary key={location.pathname}>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/irrigation" element={<Irrigation />} />
            <Route path="/products" element={<Products />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>

      <Footer />
      <MobileCallBar hide={location.pathname === "/contact"} />
    </>
  );
}

function PageFallback() {
  return (
    <main className="err" aria-busy="true">
      <div className="container">
        <div className="err__body">
          <span className="visually-hidden">Loading page…</span>
        </div>
      </div>
    </main>
  );
}
