"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Mail,
  Lock,
  Sparkles,
  LogIn,
} from "lucide-react"

export default function SignIn() {
  const router = useRouter()
  const { signIn } = useAuth()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await signIn(formData.email, formData.password)
      router.push("/dashboard")
    } catch {
      // Don't show backend error like "Invalid credentials"
      setError("Email or password is incorrect")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl sm:h-80 sm:w-80" />

        <div className="absolute -bottom-28 -right-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl sm:h-80 sm:w-80" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Main */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-4 sm:px-6">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* Back */}
          <div className="mb-4 sm:mb-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-4 text-center sm:mb-5">
            <motion.div
              className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.35 }}
            >
              <Sparkles className="h-4 w-4 text-blue-400" />
            </motion.div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back
            </h1>

            <p className="mt-1.5 text-xs leading-5 text-slate-400 sm:text-sm">
              Sign in to continue using CardForge.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/75 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
            <div className="mb-4 h-px w-full bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-medium text-slate-300 sm:text-sm"
                >
                  Email
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    className="h-11 w-full rounded-xl border border-slate-700/80 bg-slate-950/70 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-600 transition-all duration-200 focus:border-blue-500/70 focus:bg-slate-950 focus:ring-4 focus:ring-blue-500/10"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-medium text-slate-300 sm:text-sm"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    className="h-11 w-full rounded-xl border border-slate-700/80 bg-slate-950/70 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-600 transition-all duration-200 focus:border-blue-500/70 focus:bg-slate-950 focus:ring-4 focus:ring-blue-500/10"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-xs text-red-400 sm:text-sm"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  <p>{error}</p>
                </motion.div>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                className="group relative mt-1 flex h-11 w-full items-center justify-center overflow-hidden rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 sm:h-12"
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
              >
                <span className="absolute inset-0 bg-linear-to-r from-blue-500/0 via-white/10 to-blue-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <span className="relative flex items-center gap-2">
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            {/* Sign Up */}
            <p className="mt-4 text-center text-xs text-slate-400 sm:text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="font-medium text-blue-400 transition-colors hover:text-blue-300"
              >
                Create one
              </Link>
            </p>
          </div>

          {/* Tiny footer */}
          <p className="mt-3 text-center text-[10px] text-slate-600 sm:text-xs">
            Securely access your CardForge workspace.
          </p>
        </motion.div>
      </div>
    </main>
  )
}