'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { 
  Bell, 
  Lock, 
  Database, 
  Mail, 
  Zap, 
  Settings2, 
  ShieldCheck, 
  Loader2,
  HelpCircle
} from 'lucide-react'

type TabType = 'general' | 'notifications' | 'security' | 'database' | 'email' | 'payment'

export default function SettingsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<TabType>('general')
  const [isSaving, setIsSaving] = useState(false)

  // Settings states
  const [systemConfig, setSystemConfig] = useState({
    platformName: 'SIMPUL',
    platformUrl: 'simpul.marketplace.id',
    supportEmail: 'support@simpul.com',
    adminEmail: 'admin@simpul.com'
  })

  const [feeConfig, setFeeConfig] = useState({
    platformFee: '1.0',
    microFee: '0.5'
  })

  const [settlementConfig, setSettlementConfig] = useState({
    frequency: 'AUTOMATIC_H1',
    disputeHoldDays: '14'
  })

  const [securityConfig, setSecurityConfig] = useState({
    mfaEnabled: true,
    sessionTimeout: '60',
    ipWhitelist: ''
  })

  const [emailConfig, setEmailConfig] = useState({
    smtpHost: 'smtp.simpul.com',
    smtpPort: '587',
    smtpUser: 'no-reply@simpul.com',
    smtpPass: '••••••••••••'
  })

  const [notifConfig, setNotifConfig] = useState({
    emailAlerts: true,
    slackWebhook: 'https://hooks.slack.com/services/T00/B00/X00',
    frequency: 'IMMEDIATE'
  })

  const [databaseConfig, setDatabaseConfig] = useState({
    dbHost: 'db.simpul.id',
    dbPort: '5432',
    backupFrequency: 'DAILY'
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    // ponytail: Simulating system config persistence delay
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: 'Pengaturan Disimpan',
        description: 'Seluruh konfigurasi platform berhasil diperbarui dan diterapkan.',
      })
    }, 1200)
  }

  const tabs = [
    { id: 'general', label: 'Konfigurasi Sistem', icon: Settings2 },
    { id: 'payment', label: 'Pemrosesan & Fee', icon: Zap },
    { id: 'notifications', label: 'Notifikasi & Alert', icon: Bell },
    { id: 'security', label: 'Akses & Keamanan', icon: Lock },
    { id: 'database', label: 'Data & Integrasi', icon: Database },
    { id: 'email', label: 'Konfigurasi Email', icon: Mail },
  ]

  const ActiveIcon = tabs.find(t => t.id === activeTab)?.icon || Settings2

  return (
    <main className="flex flex-1 flex-col gap-md p-md md:p-lg bg-background">
      <div>
        <h1 className="font-heading text-headline-lg text-on-surface font-bold">Pengaturan Platform</h1>
        <p className="text-body-md text-on-surface-variant">Konfigurasi variabel sistem, pembagian fee bagi hasil, dan integrasi eksternal SIMPUL.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-md items-start">
        {/* Left Side: Tabs Nav */}
        <Card className="w-full lg:w-72 p-sm bg-surface-container-lowest border border-outline-variant flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible shrink-0 gap-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-xs px-sm py-2 rounded-md text-left text-label-sm font-semibold transition-colors shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </Card>

        {/* Right Side: Form details */}
        <Card className="flex-1 w-full p-md md:p-lg bg-surface-container-lowest border border-outline-variant">
          <form onSubmit={handleSave} className="space-y-md">
            <h2 className="text-headline-md text-on-surface font-semibold pb-xs border-b border-outline-variant flex items-center gap-xs">
              <ActiveIcon className="h-5 w-5 text-primary" />
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>

            {/* General System Config */}
            {activeTab === 'general' && (
              <div className="space-y-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="space-y-1">
                    <label className="text-label-sm font-medium">Nama Platform</label>
                    <Input 
                      required
                      value={systemConfig.platformName}
                      onChange={e => setSystemConfig({ ...systemConfig, platformName: e.target.value })}
                      className="bg-surface-container border border-outline-variant text-on-surface"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-label-sm font-medium">URL Platform</label>
                    <Input 
                      required
                      value={systemConfig.platformUrl}
                      onChange={e => setSystemConfig({ ...systemConfig, platformUrl: e.target.value })}
                      className="bg-surface-container border border-outline-variant text-on-surface font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="space-y-1">
                    <label className="text-label-sm font-medium">Email Dukungan (Support)</label>
                    <Input 
                      required
                      type="email"
                      value={systemConfig.supportEmail}
                      onChange={e => setSystemConfig({ ...systemConfig, supportEmail: e.target.value })}
                      className="bg-surface-container border border-outline-variant text-on-surface"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-label-sm font-medium">Email Admin</label>
                    <Input 
                      required
                      type="email"
                      value={systemConfig.adminEmail}
                      onChange={e => setSystemConfig({ ...systemConfig, adminEmail: e.target.value })}
                      className="bg-surface-container border border-outline-variant text-on-surface"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment & Fee Processing */}
            {activeTab === 'payment' && (
              <div className="space-y-md">
                <div className="bg-surface-container p-md border border-outline-variant rounded-md flex gap-sm items-start">
                  <HelpCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-body-sm font-bold">Aturan Bagi Hasil & Platform Fee</h4>
                    <p className="text-label-xs text-on-surface-variant leading-relaxed">
                      Komisi otomatis dipotong langsung dari Gross Amount tiap invoice QRIS yang diselesaikan pengantin. Sisa Net Amount didistribusikan ke Holding Funds vendor.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="space-y-1">
                    <label className="text-label-sm font-medium">Platform Fee Platform (%)</label>
                    <div className="relative">
                      <Input 
                        required
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={feeConfig.platformFee}
                        onChange={e => setFeeConfig({ ...feeConfig, platformFee: e.target.value })}
                        className="bg-surface-container border border-outline-variant text-on-surface pr-8"
                      />
                      <span className="absolute right-3 top-2.5 text-label-sm text-on-surface-variant font-bold">%</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-label-sm font-medium">PJP Micro Fee (%)</label>
                    <div className="relative">
                      <Input 
                        required
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={feeConfig.microFee}
                        onChange={e => setFeeConfig({ ...feeConfig, microFee: e.target.value })}
                        className="bg-surface-container border border-outline-variant text-on-surface pr-8"
                      />
                      <span className="absolute right-3 top-2.5 text-label-sm text-on-surface-variant font-bold">%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-md pt-sm border-t border-outline-variant">
                  <div className="space-y-1">
                    <label className="text-label-sm font-medium">Aturan Frekuensi Penyelesaian (Settlement)</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-outline-variant bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      value={settlementConfig.frequency}
                      onChange={e => setSettlementConfig({ ...settlementConfig, frequency: e.target.value })}
                    >
                      <option value="AUTOMATIC_H1">Otomatis H+1 Hari Kerja</option>
                      <option value="AUTOMATIC_H2">Otomatis H+2 Hari Kerja</option>
                      <option value="MANUAL_HOLD">Manual Hold (Menunggu Konfirmasi Admin)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-label-sm font-medium">Masa Penahanan Kasus Dispute (Hari)</label>
                    <div className="relative">
                      <Input 
                        required
                        type="number"
                        min="1"
                        max="90"
                        value={settlementConfig.disputeHoldDays}
                        onChange={e => setSettlementConfig({ ...settlementConfig, disputeHoldDays: e.target.value })}
                        className="bg-surface-container border border-outline-variant text-on-surface pr-12"
                      />
                      <span className="absolute right-3 top-2.5 text-label-xs text-on-surface-variant font-bold">Hari</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Configuration */}
            {activeTab === 'notifications' && (
              <div className="space-y-sm">
                <div className="flex items-center justify-between p-sm bg-surface-container border border-outline-variant rounded">
                  <div>
                    <p className="text-body-sm font-bold">Kirim Alert Email</p>
                    <p className="text-label-xs text-on-surface-variant">Kirim email ke admin untuk log audit kritis dan dispute baru.</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={notifConfig.emailAlerts}
                    onChange={e => setNotifConfig({ ...notifConfig, emailAlerts: e.target.checked })}
                    className="h-4 w-4 rounded border-outline-variant bg-surface-container text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-label-sm font-medium">URL Webhook Slack Alert</label>
                  <Input 
                    value={notifConfig.slackWebhook}
                    onChange={e => setNotifConfig({ ...notifConfig, slackWebhook: e.target.value })}
                    className="bg-surface-container border border-outline-variant text-on-surface font-mono"
                    placeholder="https://hooks.slack.com/services/..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-label-sm font-medium">Frekuensi Laporan Ringkasan</label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-outline-variant bg-surface-container text-on-surface text-sm focus:outline-none"
                    value={notifConfig.frequency}
                    onChange={e => setNotifConfig({ ...notifConfig, frequency: e.target.value })}
                  >
                    <option value="IMMEDIATE">Setiap Kejadian</option>
                    <option value="DAILY">Harian</option>
                    <option value="WEEKLY">Mingguan</option>
                  </select>
                </div>
              </div>
            )}

            {/* Security Configuration */}
            {activeTab === 'security' && (
              <div className="space-y-sm">
                <div className="flex items-center justify-between p-sm bg-surface-container border border-outline-variant rounded">
                  <div>
                    <p className="text-body-sm font-bold">Wajibkan MFA (Multi-Factor Auth)</p>
                    <p className="text-label-xs text-on-surface-variant">Seluruh admin wajib mengaktifkan autentikasi 2-Faktor.</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={securityConfig.mfaEnabled}
                    onChange={e => setSecurityConfig({ ...securityConfig, mfaEnabled: e.target.checked })}
                    className="h-4 w-4 rounded border-outline-variant bg-surface-container text-primary"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="space-y-1">
                    <label className="text-label-sm font-medium">Batas Waktu Sesi (Menit)</label>
                    <Input 
                      required
                      type="number"
                      value={securityConfig.sessionTimeout}
                      onChange={e => setSecurityConfig({ ...securityConfig, sessionTimeout: e.target.value })}
                      className="bg-surface-container border border-outline-variant text-on-surface"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-label-sm font-medium">Daftar Putih IP (IP Whitelist)</label>
                    <Input 
                      value={securityConfig.ipWhitelist}
                      onChange={e => setSecurityConfig({ ...securityConfig, ipWhitelist: e.target.value })}
                      className="bg-surface-container border border-outline-variant text-on-surface"
                      placeholder="Contoh: 192.168.1.1, 10.0.0.1 (Kosongkan untuk semua)"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Data & Integrations */}
            {activeTab === 'database' && (
              <div className="space-y-sm">
                <div className="grid grid-cols-3 gap-md">
                  <div className="col-span-2 space-y-1">
                    <label className="text-label-sm font-medium">Host Database Utama</label>
                    <Input 
                      required
                      value={databaseConfig.dbHost}
                      onChange={e => setDatabaseConfig({ ...databaseConfig, dbHost: e.target.value })}
                      className="bg-surface-container border border-outline-variant text-on-surface font-mono"
                    />
                  </div>
                  <div className="col-span-1 space-y-1">
                    <label className="text-label-sm font-medium">Port</label>
                    <Input 
                      required
                      value={databaseConfig.dbPort}
                      onChange={e => setDatabaseConfig({ ...databaseConfig, dbPort: e.target.value })}
                      className="bg-surface-container border border-outline-variant text-on-surface font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-label-sm font-medium">Frekuensi Cadangan Data (Backup)</label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-outline-variant bg-surface-container text-on-surface text-sm focus:outline-none"
                    value={databaseConfig.backupFrequency}
                    onChange={e => setDatabaseConfig({ ...databaseConfig, backupFrequency: e.target.value })}
                  >
                    <option value="HOURLY">Tiap Jam</option>
                    <option value="DAILY">Harian</option>
                    <option value="WEEKLY">Mingguan</option>
                  </select>
                </div>
              </div>
            )}

            {/* Email Configurations */}
            {activeTab === 'email' && (
              <div className="space-y-sm">
                <div className="grid grid-cols-3 gap-md">
                  <div className="col-span-2 space-y-1">
                    <label className="text-label-sm font-medium">Server SMTP</label>
                    <Input 
                      required
                      value={emailConfig.smtpHost}
                      onChange={e => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })}
                      className="bg-surface-container border border-outline-variant text-on-surface font-mono"
                    />
                  </div>
                  <div className="col-span-1 space-y-1">
                    <label className="text-label-sm font-medium">Port SMTP</label>
                    <Input 
                      required
                      value={emailConfig.smtpPort}
                      onChange={e => setEmailConfig({ ...emailConfig, smtpPort: e.target.value })}
                      className="bg-surface-container border border-outline-variant text-on-surface font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="space-y-1">
                    <label className="text-label-sm font-medium">Username SMTP</label>
                    <Input 
                      required
                      value={emailConfig.smtpUser}
                      onChange={e => setEmailConfig({ ...emailConfig, smtpUser: e.target.value })}
                      className="bg-surface-container border border-outline-variant text-on-surface"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-label-sm font-medium">Password SMTP</label>
                    <Input 
                      required
                      type="password"
                      value={emailConfig.smtpPass}
                      onChange={e => setEmailConfig({ ...emailConfig, smtpPass: e.target.value })}
                      className="bg-surface-container border border-outline-variant text-on-surface"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-md border-t border-outline-variant">
              <Button 
                type="submit" 
                disabled={isSaving}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-lg"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-xs animate-spin" /> Menyimpan...
                  </>
                ) : (
                  'Simpan Perubahan'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  )
}
