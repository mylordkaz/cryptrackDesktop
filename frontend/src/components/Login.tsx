import { useState } from "react";
import { Login, LoginWithTouchID, Register } from "../../wailsjs/go/main/App";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import logoLight from "../assets/images/logo-light.png";
import logoDark from "../assets/images/logo-dark.png";

export function LoginForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setIsAuthenticated } = useAuth();
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        await Register(username, password);
      } else {
        await Login(username, password);
      }
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-dark-surface py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <img
            src={theme === "dark" ? logoDark : logoLight}
            alt="Cryptrack Logo"
            className="w-48 h-48 mb-4"
          />
          <h1 className="text-4xl font-bold text-text dark:text-dark-text mb-2">
            Cryptrack
          </h1>
          <h3 className="text-xl text-text-secondary dark:text-dark-text-secondary">
            Crypto Portfolio Tracker
          </h3>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text dark:text-dark-text">
            {isRegister ? "Create an account" : "Sign in to your account"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-border dark:border-dark-border placeholder-text-light dark:placeholder-dark-text-light text-text dark:text-dark-text bg-surface-card dark:bg-dark-surface-card focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary focus:z-10 sm:text-sm mb-4"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-border dark:border-dark-border placeholder-text-light dark:placeholder-dark-text-light text-text dark:text-dark-text bg-surface-card dark:bg-dark-surface-card focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 dark:text-dark-accent-error text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary dark:bg-dark-primary hover:bg-primary-light dark:hover:bg-dark-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-dark-primary"
            >
              {isRegister ? "Register" : "Sign in"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-primary dark:text-dark-primary hover:text-primary-light dark:hover:text-dark-primary-light"
          >
            {isRegister
              ? "Already have an account? Sign in"
              : "Need an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
