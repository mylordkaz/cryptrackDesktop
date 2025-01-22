import "./App.css";

import { Dashboard } from "./components/Dashboard";
import { LoginForm } from "./components/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-surface">
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
