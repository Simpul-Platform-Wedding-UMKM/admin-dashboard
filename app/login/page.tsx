'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { loginWithEmailPassword } from '@/lib/services/auth'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError('')

    const errors: { email?: string; password?: string } = {}
    if (!EMAIL_REGEX.test(email)) errors.email = 'Masukkan format email yang valid'
    if (!password) errors.password = 'Password wajib diisi'
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setIsSubmitting(true)
    const result = await loginWithEmailPassword(email, password)
    setIsSubmitting(false)

    if (!result.success) {
      setFormError(result.message)
      return
    }

    router.push('/dashboard')
  }

  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-[#FAF8F7] p-0 sm:p-6 lg:p-10 2xl:p-14 font-sans selection:bg-[#8B5A5A]/15 selection:text-[#8B5A5A]">
      {/* ── Auth Card — 16:9 on sm+ screens, natural height on mobile ── */}
      <div className="relative flex w-full max-w-6xl 2xl:max-w-[1440px] flex-col overflow-hidden bg-white sm:aspect-video sm:max-h-[calc(100dvh-5rem)] sm:flex-row sm:rounded-2xl sm:shadow-xl sm:border sm:border-neutral-100">

        {/* ═══ LEFT PANEL: Logo & Brand (hidden on mobile, shown ≥ sm) ═══ */}
        <div className="relative hidden sm:flex sm:w-[46%] lg:w-[50%] shrink-0 flex-col items-center justify-center overflow-hidden bg-neutral-950">
          {/* Background photo */}
          <img
            src="/images/wedding-bg.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-80"
          />
          {/* Brand gradient overlay for legibility & tone consistency */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#3a1f1f]/80 via-[#5a3333]/55 to-[#8B5A5A]/70" />

          {/* Logo card */}
          <div className="relative z-10 flex flex-col items-center gap-6 px-8 2xl:gap-8">
            <div className="rounded-2xl bg-white/95 px-8 py-6 shadow-lg backdrop-blur-sm 2xl:px-12 2xl:py-8">
              <img
                src="/images/logo.png"
                alt="SIMPUL"
                className="h-9 w-auto object-contain lg:h-11 2xl:h-14"
              />
            </div>
            <div className="space-y-1.5 text-center">
              <p className="text-[10px] tracking-widest uppercase font-semibold text-white/70 2xl:text-xs">
                SIMPUL Wedding
              </p>
              <p className="font-heading text-lg lg:text-xl 2xl:text-2xl font-bold text-white tracking-tight max-w-[280px] 2xl:max-w-sm">
                Admin Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* ═══ RIGHT PANEL: Form Area ═══ */}
        <div className="flex flex-1 flex-col overflow-y-auto bg-white px-6 py-8 sm:px-8 sm:py-8 md:px-12 md:py-10 lg:px-16 2xl:px-24">

          {/* Mobile-only compact logo header */}
          <div className="mb-8 flex items-center justify-center sm:hidden">
            <img src="/images/logo.png" alt="SIMPUL" className="h-8 w-auto object-contain" />
          </div>

          {/* Center Content Section */}
          <div className="my-auto w-full max-w-[420px] 2xl:max-w-[520px] mx-auto">
            {/* Headline */}
            <div className="mb-8 space-y-2 2xl:mb-10 2xl:space-y-3">
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-[34px] 2xl:text-[44px] font-black tracking-tight text-[#1A1515] leading-[1.1] uppercase">
                KELOLA<br />
                EKOSISTEM WEDDING<br />
                ANDA
              </h1>
              <p className="text-xs sm:text-sm 2xl:text-base text-neutral-500 font-normal leading-relaxed">
                Masuk ke akun admin untuk mengelola ekosistem platform.
              </p>
            </div>

            {/* Form Error Banner */}
            {formError && (
              <div
                role="alert"
                className="mb-6 flex items-center gap-3 border-l-2 border-rose-600 bg-rose-50/70 px-4 py-3 text-xs font-medium text-rose-900 animate-in fade-in duration-200"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            {/* Underline Minimalist Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6 2xl:space-y-7">
              {/* Email Field */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 2xl:text-xs">
                  EMAIL ADMIN
                </Label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={Boolean(fieldErrors.email)}
                  className="h-11 2xl:h-14 w-full rounded-none border-b-2 border-t-0 border-l-0 border-r-0 border-neutral-300 bg-transparent px-0 text-sm 2xl:text-base font-medium text-neutral-900 focus:border-[#8B5A5A] focus:outline-none transition-colors duration-200"
                />
                {fieldErrors.email && (
                  <p className="text-xs font-medium text-rose-600 mt-1">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password Field with Inline 'Lupa password?' */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 2xl:text-xs">
                    PASSWORD
                  </Label>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={Boolean(fieldErrors.password)}
                    className="h-11 2xl:h-14 w-full rounded-none border-b-2 border-t-0 border-l-0 border-r-0 border-neutral-300 bg-transparent px-0 pr-10 text-sm 2xl:text-base font-medium text-neutral-900 focus:border-[#8B5A5A] focus:outline-none transition-colors duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-700 p-1"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 2xl:h-5 2xl:w-5" /> : <Eye className="h-4 w-4 2xl:h-5 2xl:w-5" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs font-medium text-rose-600 mt-1">{fieldErrors.password}</p>
                )}
              </div>

              {/* Custom Checkbox "Ingat sesi login saya" */}
              <div className="flex items-center gap-2.5 pt-1">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(v) => setRememberMe(v === true)}
                  className="h-5 w-5 2xl:h-5 2xl:w-5 rounded-[5px] border-neutral-300 data-[state=checked]:bg-[#8B5A5A] data-[state=checked]:border-[#8B5A5A]"
                />
                <Label htmlFor="remember" className="cursor-pointer text-xs font-normal text-neutral-600 select-none 2xl:text-sm">
                  Ingat sesi login saya
                </Label>
              </div>

              {/* Solid Dark Maroon Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-13 2xl:h-15 w-full rounded-md bg-[#8B5A5A] hover:bg-[#774949] active:scale-[0.99] text-xs 2xl:text-sm font-bold tracking-widest uppercase shadow-xs transition-all duration-200 disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white 2xl:h-5 2xl:w-5" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Masuk ke Console
                    <ArrowRight className="h-4 w-4 opacity-80 2xl:h-5 2xl:w-5" />
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* Minimal Footer */}
          <footer className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-100 pt-4 text-[11px] text-neutral-400">
            <span>&copy; {new Date().getFullYear()} SIMPUL Wedding Platform</span>
          </footer>
        </div>
      </div>
    </main>
  )
}
