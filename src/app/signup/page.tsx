"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Mail, Lock, User, ArrowRight, Github, Chrome, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.href = "/reader";
    }, 800);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-white/10 p-8 rounded-3xl shadow-2xl space-y-6 backdrop-blur-xl"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-cyan-500 p-[1px] mx-auto shadow-lg shadow-violet-600/20">
            <div className="w-full h-full bg-white dark:bg-zinc-950 rounded-[15px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-violet-500" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Create Free Account
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Unlock Early Adopter Lifetime Free Access
          </p>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition"
          >
            <Chrome className="w-4 h-4 text-rose-500" />
            <span>Google</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition"
          >
            <Github className="w-4 h-4 text-zinc-900 dark:text-white" />
            <span>GitHub</span>
          </button>
        </div>

        <div className="flex items-center space-x-3 text-zinc-400">
          <div className="h-[1px] flex-1 bg-zinc-200 dark:bg-white/10" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">or</span>
          <div className="h-[1px] flex-1 bg-zinc-200 dark:bg-white/10" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-violet-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-violet-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-violet-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-violet-600/30 flex items-center justify-center space-x-2 transition disabled:opacity-50"
          >
            <span>{loading ? "Creating Account..." : "Create Account ($0 Free)"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="text-center space-y-3 pt-2">
          <p className="text-xs text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-500 font-bold hover:underline">
              Sign in
            </Link>
          </p>

          <div className="flex items-center justify-center space-x-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>End-to-End Client Encrypted</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
