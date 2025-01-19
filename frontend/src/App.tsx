import "./App.css";

import { Dashboard } from "./components/Dashboard";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-surface dark:bg-dark-surface">
        <Dashboard />
      </div>
    </ThemeProvider>
  );
}

export default App;
