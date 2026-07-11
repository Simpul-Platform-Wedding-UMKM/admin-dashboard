'use client'

import { Card } from '@/components/ui/card'
import { ChevronRight, Bell, Lock, Database, Mail, Zap } from 'lucide-react'

export default function SettingsPage() {
  const settingsSections = [
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Configure alerts and notification preferences',
      items: ['Email alerts', 'Slack integration', 'Alert frequency']
    },
    {
      icon: Lock,
      title: 'Security & Access',
      description: 'Manage security settings and access control',
      items: ['Two-factor authentication', 'API keys', 'Session management']
    },
    {
      icon: Database,
      title: 'Data & Integration',
      description: 'Manage data storage and third-party integrations',
      items: ['Database settings', 'Backup schedule', 'External APIs']
    },
    {
      icon: Mail,
      title: 'Email Configuration',
      description: 'Set up email templates and sending settings',
      items: ['SMTP settings', 'Email templates', 'Sender configuration']
    },
    {
      icon: Zap,
      title: 'Payment Processing',
      description: 'Configure payment gateways and settlement',
      items: ['QRIS settings', 'Bank integration', 'Settlement rules']
    },
  ]

  return (
    <main className="flex flex-1 flex-col gap-md p-md md:p-lg">
      <div>
        <h1 className="font-heading text-headline-lg text-on-surface">Settings</h1>
        <p className="text-body-md text-on-surface-variant">Configure platform settings and integrations</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-md">
        {settingsSections.map((section) => {
          const Icon = section.icon
          return (
            <Card key={section.title} className="p-md bg-surface-container-lowest border border-outline-variant hover:shadow-elevated transition-shadow cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-md flex-1">
                  <div className="p-sm bg-surface-container rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-headline-sm text-on-surface font-semibold mb-xs">{section.title}</p>
                    <p className="text-body-sm text-on-surface-variant mb-md">{section.description}</p>
                    <div className="flex flex-wrap gap-xs">
                      {section.items.map((item) => (
                        <span key={item} className="px-xs py-xs text-label-sm text-on-surface-variant bg-surface-container rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-on-surface-variant flex-shrink-0 mt-xs" />
              </div>
            </Card>
          )
        })}
      </div>

      {/* System Configuration */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">System Configuration</h2>
        <div className="space-y-md">
          <div className="p-md bg-surface-container rounded-md">
            <div className="flex items-center justify-between mb-sm">
              <label className="text-body-md text-on-surface font-medium">Platform Name</label>
              <p className="text-body-md text-on-surface">SIMPUL</p>
            </div>
            <p className="text-label-sm text-on-surface-variant">The official name of the platform</p>
          </div>
          
          <div className="p-md bg-surface-container rounded-md">
            <div className="flex items-center justify-between mb-sm">
              <label className="text-body-md text-on-surface font-medium">Platform URL</label>
              <p className="text-body-md text-primary font-mono">simpul.marketplace.id</p>
            </div>
            <p className="text-label-sm text-on-surface-variant">Main platform URL for all operations</p>
          </div>

          <div className="p-md bg-surface-container rounded-md">
            <div className="flex items-center justify-between mb-sm">
              <label className="text-body-md text-on-surface font-medium">Support Email</label>
              <p className="text-body-md text-primary">support@simpul.com</p>
            </div>
            <p className="text-label-sm text-on-surface-variant">Email for customer support inquiries</p>
          </div>

          <div className="p-md bg-surface-container rounded-md">
            <div className="flex items-center justify-between mb-sm">
              <label className="text-body-md text-on-surface font-medium">Admin Email</label>
              <p className="text-body-md text-primary">admin@simpul.com</p>
            </div>
            <p className="text-label-sm text-on-surface-variant">Email for system administration notifications</p>
          </div>
        </div>
      </Card>

      {/* Fee Configuration */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">Fee Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          <div className="p-md bg-surface-container rounded-md">
            <p className="text-label-md text-on-surface-variant font-semibold mb-md">Micro Fee Rate</p>
            <p className="text-headline-lg text-primary font-semibold mb-sm">1%</p>
            <p className="text-label-sm text-on-surface-variant">Per-transaction fee charged to buyers</p>
          </div>
          <div className="p-md bg-surface-container rounded-md">
            <p className="text-label-md text-on-surface-variant font-semibold mb-md">Platform Fee Rate</p>
            <p className="text-headline-lg text-primary font-semibold mb-sm">3%</p>
            <p className="text-label-sm text-on-surface-variant">Operational fee retained by platform</p>
          </div>
          <div className="p-md bg-surface-container rounded-md">
            <p className="text-label-md text-on-surface-variant font-semibold mb-md">Vendor Payout Rate</p>
            <p className="text-headline-lg text-tertiary font-semibold mb-sm">96%</p>
            <p className="text-label-sm text-on-surface-variant">Amount vendors receive after fees</p>
          </div>
        </div>
      </Card>

      {/* Settlement Rules */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">Settlement Rules</h2>
        <div className="space-y-md">
          <div className="p-md bg-surface-container rounded-md">
            <p className="text-body-md text-on-surface font-semibold mb-sm">Zero Holding Funds Principle</p>
            <p className="text-body-sm text-on-surface-variant">Amount held pending release should be minimized. All payments are released within 24-48 hours post-completion.</p>
          </div>
          <div className="p-md bg-surface-container rounded-md">
            <p className="text-body-md text-on-surface font-semibold mb-sm">Settlement Frequency</p>
            <p className="text-body-sm text-on-surface-variant">Daily settlement batches. Transactions completed by 5 PM are settled by next business day.</p>
          </div>
          <div className="p-md bg-surface-container rounded-md">
            <p className="text-body-md text-on-surface font-semibold mb-sm">Dispute Hold Duration</p>
            <p className="text-body-sm text-on-surface-variant">Funds held during active disputes until resolution. Maximum 14 days from dispute opening.</p>
          </div>
        </div>
      </Card>
    </main>
  )
}
