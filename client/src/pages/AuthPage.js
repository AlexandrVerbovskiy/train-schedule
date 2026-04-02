import React, { useState } from "react";
import * as authApi from "../api/auth";
import Input from "../components/Common/Input";
import { PrimaryButton } from "../components/Common/Button";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const { login } = useAuth();
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
        ? await authApi.login(email, password)
        : await authApi.register(email, password);

      if (data.error || (data.message && data.statusCode >= 400)) {
        throw new Error(data.message || "Something went wrong");
      }

      login(data.user, data.access_token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-white tracking-widest italic">
          Train Schedule
        </h1>
        <p className="text-slate-500 font-bold text-[10px] tracking-tight">
          {isLogin ? "Authorization Required" : "New Account Registration"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          required
        />

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm text-center font-bold">
            {error}
          </div>
        )}

        <PrimaryButton type="submit">
          {isLogin ? "Sign In" : "Create Account"}
        </PrimaryButton>
      </form>

      <div className="mt-8 text-center">
        <button
          onClick={toggleAuthMode}
          className="text-slate-400 hover:text-white text-sm font-bold transition-colors underline-offset-4 hover:underline decoration-blue-500"
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
