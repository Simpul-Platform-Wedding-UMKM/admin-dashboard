'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
    <main className="flex min-h-dvh flex-col bg-[#FBF7F6] lg:flex-row">
      {/* ── Branding panel (kanan, desktop) ─────────────────────────────── */}
      <div className="relative flex flex-col items-center justify-center gap-5 overflow-hidden px-6 py-12 text-center lg:order-2 lg:w-[45%] lg:py-0">
        {/* Soft dusty-rose gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F3DEDC] via-[#EBCBC8] to-[#DDB3AF] -z-0" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/30 blur-3xl -z-0" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl -z-0" />

        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/70 backdrop-blur-sm font-heading text-headline-lg font-bold text-primary shadow-sm lg:h-20 lg:w-20">
          S
        </div>
        <div className="relative space-y-2">
          <h1 className="font-heading text-headline-md font-semibold text-[#3E2A2A] lg:text-headline-lg">
            SIMPUL Admin Console
          </h1>
          <p className="mx-auto hidden max-w-sm text-body-md leading-relaxed text-[#5C4342]/80 lg:block">
            Kelola ekosistem wedding digital Anda — vendor, transaksi, dan kepercayaan pelanggan dalam satu tempat.
          </p>
        </div>

        {/* Feature hints — subtle, premium */}
        <div className="relative hidden w-full max-w-sm flex-col gap-3 lg:flex">
          {[
            { icon: HeartHandshake, text: 'Verifikasi vendor & kurasi pasar' },
            { icon: ShieldCheck, text: 'Bagi hasil & settlement transparan' },
            { icon: Sparkles, text: 'Wawasan pasar real-time' },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-3 rounded-xl bg-white/50 px-4 py-3 text-left backdrop-blur-sm"
            >
              <Icon className="h-4 w-4 shrink-0 text-primary" />
              <span className="text-body-sm text-[#4A3433]">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Login form (kiri) ───────────────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-md">
          {/* Brand mark — mobile only */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary font-heading text-lg font-bold text-primary-foreground">
              S
            </div>
            <div className="font-heading text-lg font-bold text-on-surface">SIMPUL Admin</div>
          </div>

          <div className="rounded-2xl border border-[#EBDCDA] bg-white p-8 shadow-[0_8px_40px_rgba(129,82,82,0.08)] md:p-10">
            <div className="space-y-1.5">
              <h2 className="font-heading text-headline-md font-bold text-on-surface">Selamat datang kembali</h2>
              <p className="text-body-md text-on-surface-variant">
                Masuk ke akun Admin Console SIMPUL Anda
              </p>
            </div>

            {/* Form-level error — soft, elegant */}
            {formError && (
              <div
                role="alert"
                className="mt-6 flex items-start gap-2.5 rounded-lg border border-error/25 bg-error-container/40 px-4 py-3 text-body-sm text-on-error-container"
              >
                <span className="mt-0.5 text-error">⚠</span>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-body-sm font-semibold text-on-surface">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@simpul.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={Boolean(fieldErrors.email)}
                  className="h-12 rounded-xl border-[#E3D2D0] bg-white px-4 text-body-md placeholder:text-muted-foreground focus-visible:ring-primary/40"
                />
                {fieldErrors.email && (
                  <p className="text-label-sm text-error">{fieldErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-body-sm font-semibold text-on-surface">
                    Password
                  </Label>
                  <span className="text-label-sm text-on-surface-variant/70">Lupa password?</span>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={Boolean(fieldErrors.password)}
                    className="h-12 rounded-xl border-[#E3D2D0] bg-white pr-12 text-body-md placeholder:text-muted-foreground focus-visible:ring-primary/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors hover:text-on-surface"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-label-sm text-error">{fieldErrors.password}</p>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <Checkbox id="remember" checked={rememberMe} onCheckedChange={(v) => setRememberMe(v === true)} />
                <Label htmlFor="remember" className="cursor-pointer text-body-sm font-normal text-on-surface-variant">
                  Ingat saya
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl bg-primary text-body-lg font-semibold shadow-sm transition-all hover:bg-primary/90 hover:shadow-md disabled:opacity-70"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Masuk
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
