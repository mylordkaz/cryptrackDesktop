import "./App.css";

import { Dashboard } from "./components/Dashboard";
import { LoginForm } from "./components/Login";
import { ThemeToggle } from "./components/ThemeToggle";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-surface">
      <div className="fixed top-6 right-6 z-50">
        <div className="bg-surface-card dark:bg-dark-surface-card rounded-lg shadow-md border border-border dark:border-dark-border">
          <ThemeToggle />
        </div>
      </div>
      {isAuthenticated ? <Dashboard /> : <LoginForm />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
