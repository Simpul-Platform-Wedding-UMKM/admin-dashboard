'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  User, 
  Filter, 
  Inbox,
  AlertCircle
} from 'lucide-react'
import { formatDate } from '@/lib/utils-simpul'

interface Message {
  id: string
  sender: 'USER' | 'ADMIN'
  senderName: string
  content: string
  timestamp: string
}

interface Ticket {
  id: string
  senderName: string
  senderEmail: string
  role: 'VENDOR' | 'BUYER'
  subject: string
  category: 'Pembayaran' | 'Kemitraan' | 'Refund' | 'Teknis'
  status: 'MENUNGGU' | 'SELESAI'
  createdAt: string
  messages: Message[]
}

const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TKT-101',
    senderName: 'Rina Beauty Wedding',
    senderEmail: 'rina.makeup@yahoo.com',
    role: 'VENDOR',
    subject: 'Kegagalan Pencairan Dana Bagi Hasil',
    category: 'Pembayaran',
    status: 'MENUNGGU',
    createdAt: '2026-07-16T10:00:00Z',
    messages: [
      {
        id: 'msg-1',
        sender: 'USER',
        senderName: 'Rina Kartika',
        content: 'Halo Admin SIMPUL, saya mencoba mencairkan dana bagi hasil sebesar Rp7.000.000 dari transaksi split-2 tetapi statusnya terus pending. Mohon bantuannya untuk diperiksa.',
        timestamp: '2026-07-16T10:00:00Z'
      }
    ]
  },
  {
    id: 'TKT-102',
    senderName: 'Alina Putri',
    senderEmail: 'alina.putri@gmail.com',
    role: 'BUYER',
    subject: 'Pengajuan Refund Catering Budi',
    category: 'Refund',
    status: 'MENUNGGU',
    createdAt: '2026-07-16T14:20:00Z',
    messages: [
      {
        id: 'msg-2',
        sender: 'USER',
        senderName: 'Alina Putri',
        content: 'Halo, saya ingin mengajukan refund untuk pesanan catering CV Budi Jaya karena rendang terlambat disajikan hingga 2 jam. Saya sudah mengajukan dispute tapi ingin tahu kelanjutannya.',
        timestamp: '2026-07-16T14:20:00Z'
      }
    ]
  },
  {
    id: 'TKT-103',
    senderName: 'CV Budi Jaya Kuliner',
    senderEmail: 'budi.catering@gmail.com',
    role: 'VENDOR',
    subject: 'Pertanyaan mengenai MOU Kerjasama',
    category: 'Kemitraan',
    status: 'SELESAI',
    createdAt: '2026-07-15T08:30:00Z',
    messages: [
      {
        id: 'msg-3',
        sender: 'USER',
        senderName: 'Budi Harjo',
        content: 'Selamat pagi, di mana saya bisa melihat draf MOU kerjasama terbaru yang telah disetujui bersama?',
        timestamp: '2026-07-15T08:30:00Z'
      },
      {
        id: 'msg-4',
        sender: 'ADMIN',
        senderName: 'Admin Super',
        content: 'Selamat pagi Pak Budi, draf MOU dapat diakses langsung pada halaman Detail Vendor di bagian Dokumen Pendukung.',
        timestamp: '2026-07-15T09:00:00Z'
      }
    ]
  }
]

export default function HelpdeskInboxPage() {
  const { toast } = useToast()
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS)
  const [selectedTicketId, setSelectedTicketId] = useState<string>(INITIAL_TICKETS[0].id)
  const [replyText, setReplyText] = useState('')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'MENUNGGU' | 'SELESAI'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const activeTicket = tickets.find(t => t.id === selectedTicketId)

  const filteredTickets = tickets.filter(t => {
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus
    const matchesSearch = t.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || !activeTicket) return

    const newReply: Message = {
      id: `msg-${Date.now()}`,
      sender: 'ADMIN',
      senderName: 'Admin Super',
      content: replyText,
      timestamp: new Date().toISOString()
    }

    const updatedTickets = tickets.map(t => {
      if (t.id === activeTicket.id) {
        return {
          ...t,
          messages: [...t.messages, newReply]
        }
      }
      return t
    })

    setTickets(updatedTickets)
    setReplyText('')
    toast({
      title: 'Balasan Terkirim',
      description: `Respon berhasil dikirim ke tiket ${activeTicket.id}.`,
    })
  }

  const toggleTicketStatus = (ticketId: string) => {
    const updatedTickets = tickets.map(t => {
      if (t.id === ticketId) {
        const newStatus = t.status === 'MENUNGGU' ? 'SELESAI' : 'MENUNGGU'
        toast({
          title: 'Status Tiket Diperbarui',
          description: `Tiket ${t.id} sekarang ditandai sebagai ${newStatus === 'SELESAI' ? 'Selesai' : 'Menunggu'}.`,
        })
        return {
          ...t,
          status: newStatus as any
        }
      }
      return t
    })
    setTickets(updatedTickets)
  }

  return (
    <main className="flex flex-col h-[calc(100vh-var(--header-height))] bg-background">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-md border-b border-outline-variant gap-sm bg-surface-container-lowest">
        <div>
          <h1 className="text-headline-md font-bold text-on-surface">Pesan Masuk Helpdesk</h1>
          <p className="text-body-sm text-on-surface-variant">Kelola keluhan dan pertanyaan dari Vendor atau Pengantin.</p>
        </div>
        <div className="flex items-center gap-xs w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <input
              type="text"
              placeholder="Cari pengirim / subjek..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full sm:w-60 pl-8 pr-3 py-1.5 rounded-md border border-outline-variant bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Filter className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-on-surface-variant" />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
            className="h-9 px-2 rounded-md border border-outline-variant bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="ALL">Semua Tiket</option>
            <option value="MENUNGGU">Menunggu</option>
            <option value="SELESAI">Selesai</option>
          </select>
        </div>
      </div>

      {/* Main split dashboard view */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left list panel */}
        <div className="w-full md:w-96 border-r border-outline-variant flex flex-col bg-surface-container-low overflow-y-auto shrink-0">
          {filteredTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-lg text-center h-48">
              <Inbox className="h-8 w-8 text-on-surface-variant opacity-40 mb-xs" />
              <p className="text-body-sm font-semibold text-on-surface-variant">Tidak ada tiket</p>
              <p className="text-label-xs text-on-surface-variant/80">Silakan sesuaikan filter pencarian Anda.</p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant">
              {filteredTickets.map(ticket => (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`w-full p-md text-left transition-colors flex flex-col gap-xs hover:bg-surface-container-high ${
                    selectedTicketId === ticket.id ? 'bg-surface-container-high border-l-4 border-primary' : ''
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-label-xs font-mono text-primary font-bold">{ticket.id}</span>
                    <Badge className={
                      ticket.status === 'MENUNGGU' 
                        ? 'bg-tertiary/10 text-tertiary border-tertiary/20' 
                        : 'bg-outline-variant text-on-surface-variant'
                    }>
                      {ticket.status === 'MENUNGGU' ? 'MENUNGGU' : 'SELESAI'}
                    </Badge>
                  </div>
                  <h4 className="text-body-sm font-bold text-on-surface truncate">{ticket.subject}</h4>
                  <div className="flex justify-between items-center w-full text-label-xs text-on-surface-variant">
                    <span className="truncate max-w-[150px]">{ticket.senderName}</span>
                    <span>{formatDate(ticket.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-xs mt-1">
                    <Badge variant="outline" className="text-label-xs py-0 px-1.5">
                      {ticket.category}
                    </Badge>
                    <Badge variant="outline" className="text-label-xs py-0 px-1.5 bg-background">
                      {ticket.role}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right chat panel */}
        <div className="flex-1 flex flex-col bg-surface-container-lowest overflow-hidden">
          {activeTicket ? (
            <>
              {/* Ticket header details */}
              <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
                <div>
                  <div className="flex items-center gap-sm">
                    <h2 className="text-body-md font-bold text-on-surface">{activeTicket.subject}</h2>
                    <Badge variant="outline">{activeTicket.category}</Badge>
                  </div>
                  <p className="text-label-xs text-on-surface-variant mt-0.5">
                    Pengirim: <span className="font-semibold">{activeTicket.senderName}</span> ({activeTicket.senderEmail}) &bull; Role: {activeTicket.role}
                  </p>
                </div>
                <div className="flex items-center gap-xs">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleTicketStatus(activeTicket.id)}
                    className="text-label-sm border-outline-variant"
                  >
                    {activeTicket.status === 'MENUNGGU' ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-xs text-tertiary" /> Selesaikan Tiket
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 mr-xs text-tertiary" /> Buka Kembali
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Chat conversation list */}
              <div className="flex-1 p-md overflow-y-auto space-y-md bg-surface-container-low/35">
                {activeTicket.messages.map(msg => (
                  <div 
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${
                      msg.sender === 'ADMIN' ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <div className="flex items-center gap-xs mb-1">
                      <User className="h-4 w-4 text-on-surface-variant" />
                      <span className="text-label-xs text-on-surface-variant font-medium">{msg.senderName}</span>
                      <span className="text-[10px] text-on-surface-variant opacity-75">{formatDate(msg.timestamp)}</span>
                    </div>
                    <div className={`p-md rounded-lg text-body-sm leading-relaxed ${
                      msg.sender === 'ADMIN' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-surface-container border border-outline-variant text-on-surface rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat action form */}
              <div className="p-md border-t border-outline-variant bg-surface-container-lowest">
                {activeTicket.status === 'SELESAI' ? (
                  <div className="flex items-center gap-xs p-sm bg-outline-variant/15 border border-outline-variant rounded-md justify-center text-body-sm text-on-surface-variant">
                    <CheckCircle2 className="h-4 w-4 text-tertiary" /> Tiket ini telah ditandai sebagai Selesai. Buka kembali tiket untuk mengirim balasan.
                  </div>
                ) : (
                  <form onSubmit={handleSendReply} className="flex gap-sm items-end">
                    <div className="flex-1">
                      <Textarea
                        placeholder="Tulis balasan tanggapan resmi Anda di sini..."
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        rows={2}
                        className="resize-none bg-surface-container border border-outline-variant focus-visible:ring-primary text-on-surface text-body-sm"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={!replyText.trim()}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-md"
                    >
                      <Send className="h-4 w-4 mr-xs" /> Kirim
                    </Button>
                  </form>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-lg text-center h-full">
              <MessageSquare className="h-12 w-12 text-on-surface-variant opacity-40 mb-sm" />
              <p className="text-body-md font-bold text-on-surface-variant">Pilih tiket percakapan</p>
              <p className="text-body-sm text-on-surface-variant">Pilih tiket di sebelah kiri untuk melihat pesan detail dan memberikan tanggapan bantuan.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
