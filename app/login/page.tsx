"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

type Mode = "landing" | "signin" | "signup"

function LoginSessionRedirect({ callbackUrl }: { callbackUrl: string }) {
  const { status } = useSession()
  const router = useRouter()
  useEffect(() => {
    if (status === "authenticated") router.replace(callbackUrl)
  }, [status, router, callbackUrl])
  return null
}

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const callbackUrl = params.get("callbackUrl") || "/"
  const authDisabled = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true"

  const [mode, setMode] = useState<Mode>("landing")
  const [siEmail, setSiEmail] = useState("")
  const [siPass, setSiPass] = useState("")
  const [suName, setSuName] = useState("")
  const [suEmail, setSuEmail] = useState("")
  const [suPass, setSuPass] = useState("")
  const [showSiPass, setShowSiPass] = useState(false)
  const [showSuPass, setShowSuPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const canSubmitSignin = useMemo(() => siEmail.trim().length > 3 && siPass.trim().length >= 6, [siEmail, siPass])
  const canSubmitSignup = useMemo(
    () => suName.trim().length > 1 && suEmail.trim().length > 3 && suPass.trim().length >= 6,
    [suName, suEmail, suPass],
  )

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  const handleEmailSignin = async () => {
    try {
      setLoading(true)
      setMsg(null)
      await sleep(500)
      router.replace(callbackUrl)
    } catch {
      setMsg("Sign in failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSignup = async () => {
    try {
      setLoading(true)
      setMsg(null)
      await sleep(500)
      router.replace(callbackUrl)
    } catch {
      setMsg("Sign up failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white relative">
      {!authDisabled && <LoginSessionRedirect callbackUrl={callbackUrl} />}

      <div className="absolute left-4 top-4 z-10">
        <button
          onClick={() => router.back()}
          aria-label="Back"
          className="inline-flex items-center justify-center rounded-full border bg-white shadow-sm hover:bg-gray-50 active:scale-95 transition px-2.5 py-2"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="w-full max-w-md mx-auto px-6 py-20">
        <div className="rounded-2xl shadow-lg bg-white p-8">
          <h1 className="text-2xl font-semibold text-center mb-2">Islamic Studies</h1>
          <p className="text-center text-sm text-gray-600 mb-6">Sign in to access your flashcards</p>

          {mode === "landing" && (
            <div className="space-y-3">
              <button
                onClick={() => signIn?.("google", { callbackUrl })}
                disabled={authDisabled}
                className={`w-full rounded-xl border px-4 py-3 font-medium ${
                  authDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-gray-50"
                } flex items-center justify-center gap-2`}
                title={authDisabled ? "Temporarily disabled" : "Sign in with Google"}
              >
                <GoogleIcon />
                <span>Sign in with Google</span>
              </button>

              <button
                onClick={() => setMode("signin")}
                className="w-full rounded-xl border px-4 py-3 font-medium hover:bg-gray-50"
              >
                Sign in
              </button>

              <div className="text-center text-sm text-gray-600 pt-2">
                Not a user yet?{" "}
                <button className="text-teal-700 hover:underline" onClick={() => setMode("signup")}>
                  Sign up
                </button>
              </div>
            </div>
          )}

          {mode === "signin" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-700 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  Back to Home
                </Link>
              </div>

              <label className="block">
                <span className="text-sm text-gray-700">Email</span>
                <input
                  type="email"
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-teal-200"
                  value={siEmail}
                  onChange={(e) => setSiEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-700">Password</span>
                <div className="mt-1 relative">
                  <input
                    type={showSiPass ? "text" : "password"}
                    className="w-full rounded-xl border px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-teal-200"
                    value={siPass}
                    onChange={(e) => setSiPass(e.target.value)}
                    placeholder="your password"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
                    onClick={() => setShowSiPass((v) => !v)}
                  >
                    {showSiPass ? "Hide" : "Show"}
                  </button>
                </div>
              </label>

              <button
                onClick={handleEmailSignin}
                disabled={!canSubmitSignin || loading}
                className="w-full rounded-xl border px-4 py-3 font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                {loading ? "Please wait..." : "Sign in"}
              </button>

              <div className="text-center text-sm text-gray-600">
                Not a user yet?{" "}
                <button className="text-teal-700 hover:underline" onClick={() => setMode("signup")}>
                  Sign up
                </button>
              </div>

              <div className="text-center">
                <button className="text-xs text-gray-500 hover:underline" onClick={() => setMode("landing")}>
                  Back
                </button>
              </div>

              {msg && <p className="text-center text-xs text-gray-600 mt-2">{msg}</p>}
            </div>
          )}

          {mode === "signup" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-700 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  Back to Home
                </Link>
              </div>

              <label className="block">
                <span className="text-sm text-gray-700">Name</span>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-teal-200"
                  value={suName}
                  onChange={(e) => setSuName(e.target.value)}
                  placeholder="Your name"
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-700">Email</span>
                <input
                  type="email"
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-teal-200"
                  value={suEmail}
                  onChange={(e) => setSuEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-700">Create password</span>
                <div className="mt-1 relative">
                  <input
                    type={showSuPass ? "text" : "password"}
                    className="w-full rounded-xl border px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-teal-200"
                    value={suPass}
                    onChange={(e) => setSuPass(e.target.value)}
                    placeholder="at least 6 characters"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
                    onClick={() => setShowSuPass((v) => !v)}
                  >
                    {showSuPass ? "Hide" : "Show"}
                  </button>
                </div>
              </label>

              <button
                onClick={handleEmailSignup}
                disabled={!canSubmitSignup || loading}
                className="w-full rounded-xl border px-4 py-3 font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                {loading ? "Please wait..." : "Create account"}
              </button>

              <div className="text-center text-sm text-gray-600">
                Already a user?{" "}
                <button className="text-teal-700 hover:underline" onClick={() => setMode("signin")}>
                  Sign in
                </button>
              </div>

              <div className="text-center">
                <button className="text-xs text-gray-500 hover:underline" onClick={() => setMode("landing")}>
                  Back
                </button>
              </div>

              {msg && <p className="text-center text-xs text-gray-600 mt-3">{msg}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-5 w-5">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.3 29.3 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10.4 0 19-8.4 19-19 0-1.3-.1-2.2-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.8 16 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16.5 4 9.9 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-1.8 13.5-4.9l-6.2-5.1C29.4 35.3 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.6 5.1C9.8 39.6 16.4 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.7-5.3 8-11.3 8-6.6 0-12-5.4-12-12S17.4 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10.4 0 19-8.4 19-19 0-1.3-.1-2.2-.4-3.5z"
      />
    </svg>
  )
}
