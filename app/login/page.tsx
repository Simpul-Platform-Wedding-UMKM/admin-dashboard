'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
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
    <main className="flex min-h-dvh flex-col lg:flex-row">
      {/* Branding panel — header on mobile, right-side panel on desktop */}
      <div className="flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-primary to-tertiary px-6 py-10 text-center lg:order-2 lg:w-1/2 lg:py-0">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 font-heading text-headline-md font-bold text-white lg:h-20 lg:w-20 lg:text-headline-lg">
          S
        </div>
        <h1 className="font-heading text-headline-md font-semibold text-white lg:text-headline-lg">
          SIMPUL Admin Console
        </h1>
        <p className="hidden max-w-sm text-body-md text-white/85 lg:block">
          Kelola ekosistem wedding digital Anda — vendor, transaksi, dan kepercayaan pelanggan dalam satu tempat.
        </p>
      </div>

      {/* Login form */}
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-10 lg:w-1/2">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-md">
          <div className="space-y-xs">
            <h2 className="font-heading text-headline-md text-on-surface">Masuk</h2>
            <p className="text-body-md text-on-surface-variant">Masuk ke akun Admin Console SIMPUL Anda</p>
          </div>

          {formError && (
            <div className="rounded-md border border-error bg-error-container px-3 py-2 text-body-sm text-on-error-container" role="alert">
              {formError}
            </div>
          )}

          <div className="space-y-xs">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@simpul.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
            />
            {fieldErrors.email && <p className="text-label-sm text-error">{fieldErrors.email}</p>}
          </div>

          <div className="space-y-xs">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(fieldErrors.password)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {fieldErrors.password && <p className="text-label-sm text-error">{fieldErrors.password}</p>}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="remember" checked={rememberMe} onCheckedChange={(v) => setRememberMe(v === true)} />
            <Label htmlFor="remember" className="cursor-pointer text-body-sm font-normal">
              Ingat saya
            </Label>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Masuk
          </Button>

          <p className="text-center text-label-sm text-on-surface-variant">
            Demo: admin@simpul.com / admin123
          </p>
        </form>
      </div>
    </main>
  )
}
