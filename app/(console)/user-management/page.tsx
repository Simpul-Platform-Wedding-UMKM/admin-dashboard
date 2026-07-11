'use client'

import { useState, useEffect } from 'react'
import { getSystemUsers } from '@/lib/services/admin'
import type { SystemUser } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Plus, AlertCircle } from 'lucide-react'

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

  return (
    <main className="flex flex-1 flex-col gap-md p-md md:p-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface">User & Role Management</h1>
          <p className="text-body-md text-on-surface-variant">Manage admin accounts, permissions, and access roles</p>
        </div>
        <button className="px-md py-sm bg-primary text-on-primary rounded-md font-semibold text-label-md hover:opacity-90 transition-opacity flex items-center gap-xs">
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Role Summary */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-md bg-surface-container-lowest border border-outline-variant">
              <Skeleton className="h-4 w-20 mb-xs" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>
      ) : error ? null : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
          <Card className="p-md bg-surface-container-lowest border border-outline-variant">
            <p className="text-label-sm text-on-surface-variant mb-xs">Total Users</p>
            <p className="text-headline-lg text-on-surface font-semibold">{users.length}</p>
          </Card>
          <Card className="p-md bg-surface-container-lowest border border-outline-variant">
            <p className="text-label-sm text-on-surface-variant mb-xs">Super Admin</p>
            <p className="text-headline-lg text-error font-semibold">{users.filter(u => u.role === 'SUPER_ADMIN').length}</p>
          </Card>
          <Card className="p-md bg-surface-container-lowest border border-outline-variant">
            <p className="text-label-sm text-on-surface-variant mb-xs">Moderators</p>
            <p className="text-headline-lg text-tertiary-container font-semibold">{users.filter(u => u.role === 'MODERATOR').length}</p>
          </Card>
          <Card className="p-md bg-surface-container-lowest border border-outline-variant">
            <p className="text-label-sm text-on-surface-variant mb-xs">Analysts</p>
            <p className="text-headline-lg text-on-surface font-semibold">{users.filter(u => u.role === 'ANALYST').length}</p>
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
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">System Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="sticky left-0 z-10 bg-surface-container-lowest text-left p-md text-label-md text-on-surface font-semibold">Name</th>
                <th className="text-left p-md text-label-md text-on-surface font-semibold">Email</th>
                <th className="text-left p-md text-label-md text-on-surface font-semibold">Role</th>
                <th className="text-left p-md text-label-md text-on-surface font-semibold">Status</th>
                <th className="text-left p-md text-label-md text-on-surface font-semibold">Last Login</th>
                <th className="text-center p-md text-label-md text-on-surface font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
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
                    <td className="p-md text-body-md text-on-surface-variant">{user.email}</td>
                    <td className="p-md">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="p-md">
                      <Badge className={user.isActive ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-surface-container text-on-surface'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="p-md text-body-sm text-on-surface-variant">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('id-ID') : 'Never'}
                    </td>
                    <td className="p-md text-center">
                      <div className="flex items-center justify-center gap-xs">
                        <button className="p-xs hover:bg-surface-container rounded transition-colors" title="Edit">
                          <Edit className="w-4 h-4 text-primary" />
                        </button>
                        <button className="p-xs hover:bg-surface-container rounded transition-colors" title="Delete">
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
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">Roles & Permissions</h2>
        <div className="space-y-md">
          {[
            { role: 'SUPER_ADMIN', perms: ['All permissions', 'System administration', 'User management', 'Full audit access'] },
            { role: 'ADMIN', perms: ['Vendor management', 'Dispute resolution', 'Report access', 'Limited user management'] },
            { role: 'MODERATOR', perms: ['Dispute resolution', 'Vendor monitoring', 'View reports', 'No user management'] },
            { role: 'ANALYST', perms: ['View analytics', 'Export data', 'View reports', 'No admin functions'] },
          ].map((item) => (
            <div key={item.role} className="p-md bg-surface-container rounded-md border border-outline-variant">
              <Badge className={getRoleColor(item.role)} style={{ marginBottom: '8px' }}>
                {item.role.replace(/_/g, ' ')}
              </Badge>
              <div className="grid grid-cols-2 gap-sm">
                {item.perms.map((perm) => (
                  <p key={perm} className="text-body-sm text-on-surface-variant">• {perm}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </main>
  )
}
