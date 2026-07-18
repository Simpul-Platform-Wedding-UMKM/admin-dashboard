'use client'

import { useState, useEffect } from 'react'
import { getSystemUsers } from '@/lib/services/admin'
import type { SystemUser } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Plus, AlertCircle, ShieldCheck } from 'lucide-react'

export default function UserRoleManagementPage() {
  const [users, setUsers] = useState<SystemUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getSystemUsers()
      setUsers(data)
    } catch {
      setError('Gagal memuat data pengguna')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'SUPER_ADMIN': 'bg-error text-on-error',
      'ADMIN': 'bg-tertiary text-on-tertiary',
      'MODERATOR': 'bg-tertiary-container text-on-tertiary-container',
      'ANALYST': 'bg-surface-container text-on-surface',
    }
    return colors[role] || 'bg-surface-container text-on-surface'
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      'SUPER_ADMIN': 'Super Admin',
      'ADMIN': 'Admin Verifikator',
      'MODERATOR': 'Moderator Sengketa',
      'ANALYST': 'Analis Platform'
    }
    return labels[role] || role
  }

  return (
    <main className="flex flex-1 flex-col gap-lg p-lg md:p-xl bg-background">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-sm">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface font-bold">Manajemen Pengguna & Peran</h1>
          <p className="text-body-md text-on-surface-variant">Kelola akun admin internal, izin akses keamanan, dan otorisasi peran.</p>
        </div>
        <button className="px-md py-sm bg-primary text-on-primary rounded-md font-semibold text-label-md hover:opacity-90 transition-opacity flex items-center gap-xs w-full sm:w-auto justify-center">
          <Plus className="w-4 h-4" />
          Tambah Pengguna
        </button>
      </div>

      {/* Role Summary */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-md bg-surface-container-lowest border border-outline-variant">
              <Skeleton className="h-4 w-20 mb-xs" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>
      ) : error ? null : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
          <Card className="p-md bg-surface-container-lowest border border-outline-variant">
            <p className="text-label-sm text-on-surface-variant mb-xs">Total Pengguna</p>
            <p className="text-headline-lg text-on-surface font-bold">{users.length}</p>
          </Card>
          <Card className="p-md bg-surface-container-lowest border border-outline-variant">
            <p className="text-label-sm text-on-surface-variant mb-xs">Super Admin</p>
            <p className="text-headline-lg text-error font-bold">{users.filter(u => u.role === 'SUPER_ADMIN').length}</p>
          </Card>
          <Card className="p-md bg-surface-container-lowest border border-outline-variant">
            <p className="text-label-sm text-on-surface-variant mb-xs">Moderator</p>
            <p className="text-headline-lg text-tertiary font-bold">{users.filter(u => u.role === 'MODERATOR').length}</p>
          </Card>
          <Card className="p-md bg-surface-container-lowest border border-outline-variant">
            <p className="text-label-sm text-on-surface-variant mb-xs">Analis</p>
            <p className="text-headline-lg text-on-surface font-bold">{users.filter(u => u.role === 'ANALYST').length}</p>
          </Card>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-lg bg-surface-container-lowest border border-outline-variant flex flex-col items-center justify-center gap-md py-xl">
          <AlertCircle className="w-10 h-10 text-error" />
          <p className="text-body-md text-on-surface-variant text-center">{error}</p>
          <Button onClick={fetchUsers} variant="default">
            Coba lagi
          </Button>
        </Card>
      )}

      {/* Users Table */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">Daftar Pengguna Sistem</h2>
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="sticky left-0 z-10 bg-surface-container-lowest text-left p-md text-label-md text-on-surface font-semibold">Nama Lengkap</th>
                <th className="text-left p-md text-label-md text-on-surface font-semibold">Email</th>
                <th className="text-left p-md text-label-md text-on-surface font-semibold">Peran Akses</th>
                <th className="text-left p-md text-label-md text-on-surface font-semibold">Status</th>
                <th className="text-left p-md text-label-md text-on-surface font-semibold">Login Terakhir</th>
                <th className="text-center p-md text-label-md text-on-surface font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-outline-variant">
                    <td className="p-md"><Skeleton className="h-5 w-32" /></td>
                    <td className="p-md"><Skeleton className="h-5 w-44" /></td>
                    <td className="p-md"><Skeleton className="h-6 w-24 rounded-full" /></td>
                    <td className="p-md"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="p-md"><Skeleton className="h-5 w-28" /></td>
                    <td className="p-md"><div className="flex items-center justify-center gap-xs"><Skeleton className="h-8 w-8 rounded" /><Skeleton className="h-8 w-8 rounded" /></div></td>
                  </tr>
                ))
              ) : error ? null : (
                users.map((user) => (
                  <tr key={user.id} className="group border-b border-outline-variant hover:bg-surface-container transition-colors">
                    <td className="sticky left-0 z-10 bg-surface-container-lowest group-hover:bg-surface-container p-md text-body-md text-on-surface font-medium">{user.name}</td>
                    <td className="p-md text-body-md text-on-surface-variant font-mono text-xs">{user.email}</td>
                    <td className="p-md">
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </td>
                    <td className="p-md">
                      <Badge className={user.isActive ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-surface-container text-on-surface-variant'}>
                        {user.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </td>
                    <td className="p-md text-body-sm text-on-surface-variant">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Belum Pernah'}
                    </td>
                    <td className="p-md text-center">
                      <div className="flex items-center justify-center gap-xs">
                        <button className="p-xs hover:bg-surface-container rounded transition-colors" title="Edit">
                          <Edit className="w-4 h-4 text-primary" />
                        </button>
                        <button className="p-xs hover:bg-surface-container rounded transition-colors" title="Hapus">
                          <Trash2 className="w-4 h-4 text-error" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Roles & Permissions */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md flex items-center gap-xs">
          <ShieldCheck className="h-5 w-5 text-primary" /> Detail Otorisasi Hak Akses Peran
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {[
            { role: 'SUPER_ADMIN', perms: ['Semua izin platform', 'Administrasi sistem penuh', 'Manajemen akun admin', 'Akses penuh catatan audit'] },
            { role: 'ADMIN', perms: ['Manajemen verifikasi vendor', 'Penyelesaian dispute sengketa', 'Akses laporan keuangan', 'Manajemen akun admin terbatas'] },
            { role: 'MODERATOR', perms: ['Penyelesaian dispute sengketa', 'Pemantauan aktivitas vendor', 'Melihat daftar laporan', 'Tanpa manajemen akun admin'] },
            { role: 'ANALYST', perms: ['Melihat analisis performa', 'Ekspor data mentah', 'Melihat laporan platform', 'Tanpa fungsi administratif'] },
          ].map((item) => (
            <div key={item.role} className="p-md bg-surface-container rounded-md border border-outline-variant">
              <Badge className={`${getRoleColor(item.role)} mb-sm`}>
                {getRoleLabel(item.role)}
              </Badge>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-xs">
                {item.perms.map((perm) => (
                  <p key={perm} className="text-body-sm text-on-surface-variant flex items-center gap-xs">
                    <span className="h-1.5 w-1.5 bg-primary rounded-full shrink-0"></span> {perm}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </main>
  )
}
