import { useState } from "react";
import { Login, LoginWithTouchID, Register } from "../../wailsjs/go/main/App";
import { useAuth } from "../context/AuthContext";

export function LoginForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setIsAuthenticated } = useAuth();

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

  const handleTouchID = async () => {
    try {
      await LoginWithTouchID();
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || "Touch ID authentication failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-dark-surface py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
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

          <div>
            <button
              type="button"
              onClick={handleTouchID}
              className="w-full flex justify-center py-2 px-4 border border-border dark:border-dark-border rounded-lg shadow-sm text-sm font-medium text-text dark:text-dark-text bg-surface-card dark:bg-dark-surface-card hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-dark-primary"
            >
              Sign in with Touch ID
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
