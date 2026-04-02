import React, { useState } from "react";
import Input from "../components/Common/Input";
import { ActionButton } from "../components/Common/Button";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = isLogin
        ? await login(email, password)
        : await register(email, password);

      if (data.error || (data.message && data.statusCode >= 400)) {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-slate-950/50 backdrop-blur-2xl rounded-4xl border border-white/5 p-8 max-w-md w-full shadow-3xl">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-bold text-white">Train Schedule</h1>
        <p className="text-slate-500 font-bold text-xs">
          {isLogin ? "Authorization Required" : "New Account Registration"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="text-sm font-bold text-slate-500 pl-2">
            Email Address
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="h-12 bg-white/5 rounded-xl border border-white/5 text-sm"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-bold text-slate-500 pl-2">
            Password
          </label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="h-12 bg-white/5 rounded-xl border border-white/5 text-sm"
            required
          />
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm text-center font-bold">
            {error}
          </div>
        )}

        <ActionButton className="w-full h-14" style={{ marginTop: "1.5rem" }} type="submit">
          {isLogin ? "Sign In" : "Sign Up"}
        </ActionButton>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={toggleAuthMode}
          className="text-slate-400 hover:text-white text-xs font-bold decoration-blue-500 transition-all duration-150 ease-in-out"
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Sign In"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
