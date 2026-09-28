import { Component } from "react";

import Button from "./Button.jsx";

/**
 * Catches render errors so a single broken page never leaves a blank screen.
 * Logs to the console for the developer; shows a plain-language message and a
 * way back to the homepage for the visitor.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // In production this is where an error-reporting service would be called.
    console.error("HydroTech site error:", error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main className="err" id="main">
        <div className="container">
          <div className="err__body">
            <span className="err__code">Error</span>
            <h1 className="t-h2">This page could not be displayed</h1>
            <p className="t-lead">
              Something went wrong while loading the page. Please try again, or contact
              HydroTech directly and we will help.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <Button to="/" onClick={() => this.setState({ error: null })}>
                Back to homepage
              </Button>
              <Button variant="ghost" onClick={() => window.location.reload()}>
                Reload the page
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
