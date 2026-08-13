'use client'

import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Map as MapIcon, RefreshCw } from 'lucide-react'
import { formatNumber } from '@/lib/utils-simpul'
import type { HeatmapPoint } from '@/lib/types'

// Dynamic script loader for Leaflet CDN integration (sama dengan halaman qris-heatmap).
function loadLeaflet(callback: (L: any) => void) {
  if (typeof window === 'undefined') return

  if ((window as any).L) {
    callback((window as any).L)
    return
  }

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

  const scriptId = 'leaflet-js-cdn'
  const existingScript = document.getElementById(scriptId)
  if (!existingScript) {
    const script = document.createElement('script')
    script.id = scriptId
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
    script.crossOrigin = ''
    script.onload = () => callback((window as any).L)
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

const getDensityColorHex = (count: number) => {
  if (count >= 35) return 'var(--md-sys-color-error)'
  if (count >= 20) return 'var(--md-sys-color-tertiary-fixed)'
  if (count >= 10) return 'var(--md-sys-color-tertiary-fixed-dim)'
  return 'var(--md-sys-color-tertiary)'
}

/// Mini heatmap card — peta kepadatan QRIS + ringkasan angka.
/// Dipakai di halaman dashboard (lebih ringkas dari halaman qris-heatmap penuh).
export function DashboardHeatmapCard({ points }: { points: HeatmapPoint[] }) {
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const circlesRef = useRef<any[]>([])

  useEffect(() => {
    if (points.length === 0) return
    loadLeaflet((L) => {
      setLeafletLoaded(true)

      if (!mapInstanceRef.current && mapRef.current) {
        const banyumasCenter: [number, number] = [-7.45, 109.25]
        const map = L.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: false,
        }).setView(banyumasCenter, 11)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map)

        mapInstanceRef.current = map
      }

      const map = mapInstanceRef.current
      if (!map) return

      setTimeout(() => map.invalidateSize(), 100)

      circlesRef.current.forEach((c) => c.remove())
      circlesRef.current = []

      points.forEach((point) => {
        const radius = Math.max(8, Math.min(30, point.count * 0.8))
        const circle = L.circleMarker([point.latitude, point.longitude], {
          radius,
          fillColor: getDensityColorHex(point.count),
          color: 'var(--md-sys-color-surface)',
          weight: 1.5,
          opacity: 0.9,
          fillOpacity: 0.65,
        }).addTo(map)

        circle.bindPopup(`
          <div class="p-1 font-sans">
            <h4 class="font-bold text-sm mb-1">${point.kecamatan}</h4>
            <p class="text-xs mb-0.5"><b>Total Vol:</b> Rp ${point.amount.toLocaleString('id-ID')}</p>
            <p class="text-xs"><b>Trx Count:</b> ${point.count} kali</p>
          </div>
        `)
        circlesRef.current.push(circle)
      })
    })
  }, [points])

  const totalVolume = points.reduce((sum, p) => sum + p.amount, 0)
  const totalCount = points.reduce((sum, p) => sum + p.count, 0)

  return (
    <Card className="p-md bg-surface-container-lowest border border-outline-variant">
      <div className="flex justify-between items-center mb-sm pb-xs border-b border-outline-variant gap-sm">
        <h3 className="min-w-0 flex-1 text-title-lg text-on-surface font-semibold flex items-center gap-xs">
          <MapIcon className="h-5 w-5 shrink-0 text-primary" /> Peta Kepadatan QRIS
        </h3>
        <span className="text-label-xs text-on-surface-variant shrink-0">
          {formatNumber(totalVolume)} &bull; {totalCount} transaksi
        </span>
      </div>

      <div className="relative w-full h-[320px] rounded-md overflow-hidden border border-outline-variant bg-surface-container">
        <div ref={mapRef} className="absolute inset-0 z-0" />
        {(!leafletLoaded || points.length === 0) && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-container/85 gap-sm">
            {points.length === 0 ? (
              <span className="text-label-md text-on-surface-variant font-medium">
                Belum ada data kepadatan transaksi.
              </span>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                <span className="text-label-md text-on-surface-variant font-medium">
                  Memuat peta...
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
