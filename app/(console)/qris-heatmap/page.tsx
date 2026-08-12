'use client'

import React, { useEffect, useState, useRef } from 'react'
import { apiFetch } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  Map as MapIcon,
  MapPin,
  TrendingUp,
  CreditCard,
  Building,
  Filter,
  RefreshCw,
  Search,
  DollarSign
} from 'lucide-react'
import { formatNumber } from '@/lib/utils-simpul'
import type { HeatmapPoint } from '@/lib/dummyData'

// List of all 27 sub-districts for the dropdown filter option
const KECAMATAN_LIST = [
  "Kecamatan Ajibarang",
  "Kecamatan Banyumas",
  "Kecamatan Baturraden",
  "Kecamatan Cilongok",
  "Kecamatan Gumelar",
  "Kecamatan Jatilawang",
  "Kecamatan Kalibagor",
  "Kecamatan Karanglewas",
  "Kecamatan Kebasen",
  "Kecamatan Kedungbanteng",
  "Kecamatan Kembaran",
  "Kecamatan Kemranjen",
  "Kecamatan Lumbir",
  "Kecamatan Patikraja",
  "Kecamatan Pekuncen",
  "Kecamatan Purwojati",
  "Kecamatan Purwokerto Barat",
  "Kecamatan Purwokerto Selatan",
  "Kecamatan Purwokerto Timur",
  "Kecamatan Purwokerto Utara",
  "Kecamatan Rawalo",
  "Kecamatan Sokaraja",
  "Kecamatan Somagede",
  "Kecamatan Sumbang",
  "Kecamatan Sumpiuh",
  "Kecamatan Tambak",
  "Kecamatan Wangon"
]

// Dynamic script loader for Leaflet CDN integration
function loadLeaflet(callback: (L: any) => void) {
  if (typeof window === 'undefined') return

  if ((window as any).L) {
    callback((window as any).L)
    return
  }

  // Load CSS
  const cssId = 'leaflet-css-cdn'
  if (!document.getElementById(cssId)) {
    const link = document.createElement('link')
    link.id = cssId
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
    link.crossOrigin = ''
    document.head.appendChild(link)
  }

  // Load JS
  const scriptId = 'leaflet-js-cdn'
  const existingScript = document.getElementById(scriptId)
  if (!existingScript) {
    const script = document.createElement('script')
    script.id = scriptId
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
    script.crossOrigin = ''
    script.onload = () => {
      callback((window as any).L)
    }
    document.body.appendChild(script)
  } else {
    const checkInterval = setInterval(() => {
      if ((window as any).L) {
        clearInterval(checkInterval)
        callback((window as any).L)
      }
    }, 100)
  }
}

export default function QrisHeatmapPage() {
  const [points, setPoints] = useState<HeatmapPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('ALL')
  const [leafletLoaded, setLeafletLoaded] = useState(false)

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const circlesRef = useRef<any[]>([])

  const fetchHeatmapData = () => {
    setLoading(true)
    setError(null)
    apiFetch<HeatmapPoint[]>('/heatmap')
      .then(setPoints)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchHeatmapData()
  }, [])

  // Color mapper based on transaction count density
  const getDensityColorHex = (count: number) => {
    if (count >= 35) return 'var(--md-sys-color-error)' // Very High
    if (count >= 20) return 'var(--md-sys-color-tertiary-fixed)' // High
    if (count >= 10) return 'var(--md-sys-color-tertiary-fixed-dim)' // Medium
    return 'var(--md-sys-color-tertiary)' // Low
  }

  // Calculate filtered stats
  const filteredPoints = selectedKecamatan === 'ALL'
    ? points
    : points.filter(p => p.kecamatan === selectedKecamatan)

  const totalVolume = filteredPoints.reduce((sum, p) => sum + p.amount, 0)
  const totalCount = filteredPoints.reduce((sum, p) => sum + p.count, 0)
  const averageTransaction = totalCount > 0 ? totalVolume / totalCount : 0

  useEffect(() => {
    if (!loading && points.length > 0) {
      loadLeaflet((L) => {
        setLeafletLoaded(true)

        // Initialize map centered on Banyumas (Purwokerto) if not yet created
        if (!mapInstanceRef.current && mapRef.current) {
          const banyumasCenter: [number, number] = [-7.45, 109.25]
          const map = L.map(mapRef.current, {
            zoomControl: true,
            scrollWheelZoom: false
          }).setView(banyumasCenter, 11)

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map)

          mapInstanceRef.current = map
        }

        const map = mapInstanceRef.current
        if (!map) return

        // Fix: Leaflet kadang ter-init saat container belum punya ukuran —
        // invalidateSize memaksa map menghitung ulang dimensi container.
        setTimeout(() => map.invalidateSize(), 100)

        // Clear existing markers/circles
        circlesRef.current.forEach(c => c.remove())
        circlesRef.current = []

        // Render circles for each point
        points.forEach((point) => {
          // Circle radius is proportional to the count (minimum 8px, scaled)
          const radius = Math.max(8, Math.min(30, point.count * 0.8))
          const color = getDensityColorHex(point.count)

          const circle = L.circleMarker([point.latitude, point.longitude], {
            radius: radius,
            fillColor: color,
            color: 'var(--md-sys-color-surface)',
            weight: 1.5,
            opacity: 0.9,
            fillOpacity: 0.65
          }).addTo(map)

          // Bind details popup
          circle.bindPopup(`
            <div class="p-1 font-sans">
              <h4 class="font-bold text-sm text-on-surface mb-1">${point.kecamatan}</h4>
              <p class="text-xs text-on-surface-variant mb-0.5"><b>Total Vol:</b> Rp ${point.amount.toLocaleString('id-ID')}</p>
              <p class="text-xs text-on-surface-variant"><b>Trx Count:</b> ${point.count} kali</p>
            </div>
          `)

          // Save circle reference
          circlesRef.current.push(circle)
        })

        // Pan/zoom to selected Kecamatan if single item is selected
        if (selectedKecamatan !== 'ALL') {
          const match = points.find(p => p.kecamatan === selectedKecamatan)
          if (match) {
            map.setView([match.latitude, match.longitude], 13)
            // Open popup for selected item
            const circle = circlesRef.current[points.indexOf(match)]
            if (circle) circle.openPopup()
          }
        } else {
          // Re-center on Banyumas
          map.setView([-7.45, 109.25], 11)
        }
      })
    }
  }, [loading, points, selectedKecamatan])

  return (
    <main className="flex flex-1 flex-col gap-lg p-md md:p-xl bg-background">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md pb-xs border-b border-outline-variant">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface font-bold">Peta Kepadatan QRIS (Heatmap)</h1>
          <p className="text-body-md text-on-surface-variant">Visualisasi spasial kepadatan transaksi dan persebaran volume QRIS per Kecamatan di Banyumas</p>
        </div>

        {/* Refresh button */}
        <Button variant="outline" size="sm" onClick={fetchHeatmapData} disabled={loading} className="gap-xs">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Sinkronkan Data
        </Button>
      </div>

      {/* Control bar */}
      <Card className="p-sm bg-surface-container-lowest border border-outline-variant flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-sm">
        <div className="flex items-center gap-xs text-label-md text-on-surface-variant">
          <Filter className="h-4 w-4 text-primary" /> Filter Lokasi Kecamatan
        </div>

        {/* Dropdown Selector */}
        <div className="relative w-full sm:w-80">
          <select
            value={selectedKecamatan}
            onChange={(e) => setSelectedKecamatan(e.target.value)}
            className="w-full bg-surface-container border border-outline-variant text-on-surface rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-tertiary"
          >
            <option value="ALL">Semua Kecamatan (Kabupaten Banyumas)</option>
            {KECAMATAN_LIST.map((kec) => (
              <option key={kec} value={kec}>{kec}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Grid Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-md">

        {/* Left Side: Summary Metrics */}
        <div className="lg:col-span-1 space-y-md flex flex-col justify-start">

          {/* Card: Total Volume */}
          <Card className="p-md bg-surface-container-lowest border border-outline-variant">
            <div className="flex justify-between items-start">
              <p className="text-label-sm text-on-surface-variant uppercase">Total Volume QRIS</p>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <p className="text-headline-md text-on-surface font-bold mt-xs break-words">{formatNumber(totalVolume)}</p>
            <p className="text-label-sm text-on-surface-variant mt-xs">Total nominal checkout sukses</p>
          </Card>

          {/* Card: Transaction Count */}
          <Card className="p-md bg-surface-container-lowest border border-outline-variant">
            <div className="flex justify-between items-start">
              <p className="text-label-sm text-on-surface-variant uppercase">Jumlah Transaksi</p>
              <CreditCard className="h-4 w-4 text-tertiary" />
            </div>
            <p className="text-headline-md text-on-surface font-bold mt-xs">{totalCount} Kali</p>
            <p className="text-label-sm text-on-surface-variant mt-xs">Total pemindaian QRIS berhasil</p>
          </Card>

          {/* Card: Average Ticket Size */}
          <Card className="p-md bg-surface-container-lowest border border-outline-variant">
            <div className="flex justify-between items-start">
              <p className="text-label-sm text-on-surface-variant uppercase">Rata-Rata Tiket</p>
              <Building className="h-4 w-4 text-tertiary" />
            </div>
            <p className="text-headline-md text-on-surface font-bold mt-xs break-words">{formatNumber(averageTransaction)}</p>
            <p className="text-label-sm text-on-surface-variant mt-xs">Nilai rata-rata per transaksi</p>
          </Card>

          {/* Card: Density Legend */}
          <Card className="p-md bg-surface-container-lowest border border-outline-variant">
            <h4 className="text-label-sm text-on-surface font-semibold uppercase mb-sm pb-xs border-b border-outline-variant">Tingkat Kepadatan Transaksi</h4>
            <div className="space-y-xs">
              <div className="flex items-center gap-sm">
                <span className="inline-block h-3.5 w-3.5 rounded-full bg-error"></span>
                <span className="text-label-md text-on-surface-variant">Sangat Padat (&ge; 35 kali)</span>
              </div>
              <div className="flex items-center gap-sm">
                <span className="inline-block h-3.5 w-3.5 rounded-full bg-tertiary-fixed"></span>
                <span className="text-label-md text-on-surface-variant">Padat (&ge; 20 kali)</span>
              </div>
              <div className="flex items-center gap-sm">
                <span className="inline-block h-3.5 w-3.5 rounded-full bg-tertiary-fixed-dim"></span>
                <span className="text-label-md text-on-surface-variant">Sedang (&ge; 10 kali)</span>
              </div>
              <div className="flex items-center gap-sm">
                <span className="inline-block h-3.5 w-3.5 rounded-full bg-tertiary"></span>
                <span className="text-label-md text-on-surface-variant">Rendah (&lt; 10 kali)</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Map Viewer */}
        <div className="lg:col-span-3">
          <Card className="p-md bg-surface-container-lowest border border-outline-variant h-full min-h-[500px] flex flex-col justify-between">
            <div className="flex justify-between items-center mb-sm pb-xs border-b border-outline-variant gap-sm">
              <h3 className="min-w-0 flex-1 text-title-lg text-on-surface font-semibold flex items-center gap-xs whitespace-nowrap overflow-hidden text-ellipsis">
                <MapIcon className="h-5 w-5 shrink-0 text-primary" /> Peta Persebaran Spasial Banyumas
              </h3>
              <Badge className="shrink-0 bg-surface-container text-on-surface font-mono text-xs">
                {selectedKecamatan === 'ALL' ? 'Mode Nasional/Regonal' : selectedKecamatan}
              </Badge>
            </div>

            {/* Map Area */}
            <div className="relative w-full flex-1 min-h-[420px] rounded-md overflow-hidden border border-outline-variant bg-surface-container">
              <div ref={mapRef} className="absolute inset-0 z-0" style={{ minHeight: 420 }} />
              {!leafletLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-surface-container/85 gap-sm">
                  <Skeleton className="h-4 w-4 rounded-full animate-pulse bg-primary" />
                  <span className="text-label-md text-on-surface-variant font-medium">Memuat Peta Spasial Banyumas...</span>
                </div>
              )}
            </div>

            <p className="text-label-sm text-on-surface-variant mt-sm text-center">
              Klik bulatan/marker di peta untuk melihat detail nominal volume dan jumlah transaksi per Kecamatan.
            </p>
          </Card>
        </div>
      </div>
    </main>
  )
}
