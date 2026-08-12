'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getPaymentSplitById } from '@/lib/services/payment'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { 
  ChevronLeft, 
  CreditCard, 
  MapPin, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  User,
  Activity,
  Calendar,
  Building
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils-simpul'
import type { ExtendedPaymentSplit } from '@/lib/dummyData'

// ponytail: resolve CSS var to hex for Leaflet
function cssVar(varName: string): string {
  if (typeof window === 'undefined') return '#000'
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
}

// Haversine formula to calculate distance in meters between two lat/long coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3 // Earth radius in meters
  const phi1 = lat1 * Math.PI / 180
  const phi2 = lat2 * Math.PI / 180
  const deltaPhi = (lat2 - lat1) * Math.PI / 180
  const deltaLambda = (lon2 - lon1) * Math.PI / 180

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // distance in meters
}

// ponytail: Dynamic script loading helper to avoid SSR errors and NPM React-Leaflet version conflicts
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
    // Wait in case it is still loading
    const checkInterval = setInterval(() => {
      if ((window as any).L) {
        clearInterval(checkInterval)
        callback((window as any).L)
      }
    }, 100)
  }
}

export default function TransactionDetailPage() {
  const params = useParams()
  const id = params?.id as string

  const [split, setSplit] = useState<ExtendedPaymentSplit | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (id) {
      setLoading(true)
      getPaymentSplitById(id)
        .then(data => {
          setSplit(data as ExtendedPaymentSplit)
          setLoading(false)
        })
        .catch(err => {
          setError(err.message || 'Gagal memuat transaksi')
          setLoading(false)
        })
    }
  }, [id])

  useEffect(() => {
    if (!loading && split && split.eventLatitude && split.eventLongitude && split.checkoutLatitude && split.checkoutLongitude) {
      loadLeaflet((L) => {
        setLeafletLoaded(true)

        // Ensure we destroy any existing map instance to avoid container reuse errors
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
        }

        if (!mapRef.current) return

        const eventLoc: [number, number] = [split.eventLatitude!, split.eventLongitude!]
        const checkoutLoc: [number, number] = [split.checkoutLatitude!, split.checkoutLongitude!]
        
        // Calculate geofence distance
        const distance = calculateDistance(
          split.eventLatitude!, split.eventLongitude!,
          split.checkoutLatitude!, split.checkoutLongitude!
        )
        const isOutside = distance > 100

        // Create map
        // Center dynamically between both points or on the event location
        const map = L.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: false
        }).setView(eventLoc, 15)
        
        mapInstanceRef.current = map

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map)

        // Draw 100m geofence circle
        const circleColor = isOutside ? cssVar('--md-sys-color-error') : cssVar('--md-sys-color-tertiary')
        const circleFill = isOutside ? cssVar('--md-sys-color-error-container') : cssVar('--md-sys-color-tertiary-container')
        L.circle(eventLoc, {
          color: circleColor,
          fillColor: circleFill,
          fillOpacity: 0.15,
          radius: 100 // 100 meters
        }).addTo(map)

        // Define beautiful modern DOM markers using L.divIcon (glowing effects)
        // 👰 Wedding location marker
        const weddingIcon = L.divIcon({
          html: `<div class="relative flex items-center justify-center">
                   <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-primary opacity-60"></span>
                   <div class="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-elevated border-2 border-white text-base">
                     👰
                   </div>
                 </div>`,
          className: 'custom-div-icon',
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        })

        // 🏪 Vendor check-in / QRIS scan marker
        const vendorIconColor = isOutside ? 'bg-error' : 'bg-tertiary'
        const vendorIconPulse = isOutside ? 'bg-error opacity-40' : 'bg-tertiary opacity-40'
        const vendorIcon = L.divIcon({
          html: `<div class="relative flex items-center justify-center">
                   <span class="animate-pulse absolute inline-flex h-8 w-8 rounded-full ${vendorIconPulse}"></span>
                   <div class="relative flex h-10 w-10 items-center justify-center rounded-full ${vendorIconColor} text-white shadow-elevated border-2 border-white text-base">
                     🏪
                   </div>
                 </div>`,
          className: 'custom-div-icon',
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        })

        // Add markers
        L.marker(eventLoc, { icon: weddingIcon })
          .addTo(map)
          .bindPopup(`<b>Lokasi Pernikahan (Pengantin)</b><br/>Jarak geofence: 100m`)
          .openPopup()

        L.marker(checkoutLoc, { icon: vendorIcon })
          .addTo(map)
          .bindPopup(`<b>Lokasi Scan QRIS Vendor</b><br/>Jarak dari lokasi: ${distance >= 1000 ? `${(distance/1000).toFixed(2)} km` : `${Math.round(distance)} meter`}`)

        // Adjust bounds to fit both points nicely
        const bounds = L.latLngBounds([eventLoc, checkoutLoc])
        map.fitBounds(bounds, { padding: [50, 50] })
      })
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [loading, split])

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-lg p-md md:p-xl bg-background">
        <Skeleton className="h-6 w-32 mb-xs" />
        <Skeleton className="h-10 w-96 mb-md" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
          <Card className="lg:col-span-2 p-md h-80"><Skeleton className="h-full w-full" /></Card>
          <Card className="lg:col-span-1 p-md space-y-md"><Skeleton className="h-full w-full" /></Card>
        </div>
      </main>
    )
  }

  if (error || !split) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center p-md py-20 gap-md">
        <AlertTriangle className="h-12 w-12 text-error" />
        <h2 className="text-headline-md text-on-surface font-semibold">Transaksi Tidak Ditemukan</h2>
        <p className="text-body-md text-on-surface-variant">{error || 'Transaksi dengan ID tersebut tidak tersedia.'}</p>
        <Link href="/transactions">
          <Button variant="outline">
            <ChevronLeft className="mr-xs h-4 w-4" /> Kembali ke Transaksi
          </Button>
        </Link>
      </main>
    )
  }

  // Geofence calculations
  const distance = split.eventLatitude && split.checkoutLatitude
    ? calculateDistance(split.eventLatitude, split.eventLongitude!, split.checkoutLatitude, split.checkoutLongitude!)
    : 0
  const isOutsideGeofence = distance > 100

  // Fee calculation helper
  const microFee = split.microFeeAmount
  const platformFee = split.platformFeeAmount
  const netAmount = split.netAmount

  return (
    <main className="flex flex-1 flex-col gap-lg p-md md:p-xl bg-background">
      {/* Navigation Header */}
      <div className="flex items-center gap-xs">
        <Link href="/transactions" className="text-label-md text-on-surface-variant hover:text-on-surface flex items-center transition-colors">
          <ChevronLeft className="h-4 w-4" /> Kembali ke Daftar Transaksi
        </Link>
      </div>

      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md pb-xs border-b border-outline-variant">
        <div>
          <div className="flex items-center gap-sm mb-xs">
            <h1 className="font-heading text-headline-lg text-on-surface font-bold">Split ID: {split.id}</h1>
            <Badge className={
              split.status === 'RELEASED'
                ? 'bg-tertiary-container text-on-tertiary-container'
                : split.status === 'HOLDING'
                  ? 'bg-tertiary text-on-tertiary'
                  : 'bg-error text-on-error'
            }>
              {split.status}
            </Badge>
          </div>
          <p className="text-body-md text-on-surface-variant">Booking ID: <span className="font-semibold">{split.bookingId}</span> &bull; Terdaftar pada {formatDate(split.createdAt)}</p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        
        {/* Left Side: Map Widget & Geofence Warning Box */}
        <div className="lg:col-span-2 space-y-md">
          
          {/* Leaflet Map Widget */}
          <Card className="p-md bg-surface-container-lowest border border-outline-variant">
            <div className="flex justify-between items-center mb-sm pb-xs border-b border-outline-variant">
              <h3 className="text-headline-md text-on-surface font-semibold flex items-center gap-xs">
                <MapPin className="h-5 w-5 text-primary" /> GPS Geofencing Zonasi Hari-H
              </h3>
              
              {/* Geofence Status Badge */}
              {isOutsideGeofence ? (
                <Badge className="bg-error text-on-error font-bold flex items-center gap-xs py-1 px-2.5">
                  <AlertTriangle className="h-3 w-3" /> Potensi Deviasi Zonasi
                </Badge>
              ) : (
                <Badge className="bg-tertiary-container text-on-tertiary-container font-bold flex items-center gap-xs py-1 px-2.5">
                  <CheckCircle className="h-3 w-3" /> Zonasi Aman
                </Badge>
              )}
            </div>

            {/* Warning Message Card */}
            {isOutsideGeofence && (
              <div className="mb-md p-sm bg-error-container border border-error/20 rounded-md flex items-start gap-xs">
                <AlertTriangle className="h-5 w-5 text-error mt-0.5" />
                <div>
                  <p className="text-body-sm font-semibold text-error">Warning: Potensi Deviasi Zonasi Terdeteksi</p>
                  <p className="text-label-md text-on-surface-variant mt-xs">
                    Titik pemindaian QRIS kehadiran / pengerjaan Hari-H oleh vendor berjarak <span className="font-bold text-on-surface">{(distance / 1000).toFixed(2)} km</span> dari lokasi asli resepsi pengantin. Jarak ini melebihi ambang batas aman <span className="font-bold">100 meter</span>. Sengketa pembayaran berpotensi dipicu jika vendor terbukti melakukan pemalsuan kehadiran (wanprestasi).
                  </p>
                </div>
              </div>
            )}

            {!isOutsideGeofence && (
              <div className="mb-md p-sm bg-tertiary-container border border-tertiary/20 rounded-md flex items-start gap-xs">
                <CheckCircle className="h-5 w-5 text-tertiary-container mt-0.5" />
                <div>
                  <p className="text-body-sm font-semibold text-tertiary-container">Verifikasi Kehadiran Valid</p>
                  <p className="text-label-md text-on-surface-variant mt-xs">
                    Pemindaian QRIS diselesaikan dalam radius aman <span className="font-semibold">{Math.round(distance)} meter</span> dari lokasi acara pernikahan. Kehadiran vendor terverifikasi secara spasial.
                  </p>
                </div>
              </div>
            )}

            {/* Map Container */}
            <div className="relative w-full h-96 rounded-md overflow-hidden border border-outline-variant bg-surface-container">
              <div ref={mapRef} className="w-full h-full z-0" />
              {!leafletLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-surface-container/85 gap-sm">
                  <Skeleton className="h-4 w-4 rounded-full animate-pulse bg-primary" />
                  <span className="text-label-md text-on-surface-variant font-medium">Memuat Peta Spasial...</span>
                </div>
              )}
            </div>

            {/* Map Legend */}
            <div className="flex gap-md justify-center items-center mt-sm text-label-sm text-on-surface-variant border-t border-outline-variant pt-sm">
              <div className="flex items-center gap-xs">
                <span className="inline-block h-3.5 w-3.5 rounded-full bg-primary flex items-center justify-center border border-white text-[9px] text-white">👰</span>
                <span>Lokasi Pernikahan Pengantin</span>
              </div>
              <div className="flex items-center gap-xs">
                <span className={`inline-block h-3.5 w-3.5 rounded-full ${isOutsideGeofence ? 'bg-error' : 'bg-tertiary'} flex items-center justify-center border border-white text-[9px] text-white`}>🏪</span>
                <span>Lokasi Scan QRIS Vendor</span>
              </div>
              <div className="flex items-center gap-xs">
                <span className={`inline-block h-3 w-6 rounded-full border border-dashed ${isOutsideGeofence ? 'border-error bg-error/5' : 'border-tertiary bg-tertiary/5'}`}></span>
                <span>Radius Geofence (100 Meter)</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Financial Splits & Vendor Information */}
        <div className="lg:col-span-1 space-y-md">
          
          {/* Revenue Split Breakdown Card */}
          <Card className="p-md bg-surface-container-lowest border border-outline-variant">
            <h3 className="text-headline-md text-on-surface font-semibold mb-md pb-xs border-b border-outline-variant flex items-center gap-xs">
              <TrendingUp className="h-5 w-5 text-tertiary" /> Rincian Split Payment
            </h3>

            <div className="space-y-sm">
              <div>
                <p className="text-label-sm text-on-surface-variant uppercase">Nama Item Booking</p>
                <p className="text-body-md text-on-surface font-semibold">{(split as any).serviceName || split.bookingItemId}</p>
              </div>

              <div className="pt-xs border-t border-outline-variant space-y-sm">
                <div className="flex justify-between items-center">
                  <span className="text-body-md text-on-surface">Total Pembayaran Gross</span>
                  <span className="text-body-md text-on-surface font-semibold">{formatCurrency(split.grossAmount)}</span>
                </div>
                
                <div className="flex justify-between items-center text-label-md text-on-surface-variant">
                  <span className="flex items-center gap-xs">Biaya Mikro PJP (0.5%)</span>
                  <span>- {formatCurrency(microFee)}</span>
                </div>

                <div className="flex justify-between items-center text-label-md text-on-surface-variant">
                  <span className="flex items-center gap-xs">Fee Platform SIMPUL (1%)</span>
                  <span>- {formatCurrency(platformFee)}</span>
                </div>

                <div className="pt-xs border-t border-outline-variant flex justify-between items-center">
                  <span className="text-body-md font-bold text-on-surface">Net Payout Vendor</span>
                  <span className="text-headline-md font-bold text-tertiary">{formatCurrency(netAmount)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Vendor Details Card */}
          <Card className="p-md bg-surface-container-lowest border border-outline-variant">
            <h3 className="text-headline-md text-on-surface font-semibold mb-md pb-xs border-b border-outline-variant flex items-center gap-xs">
              <Building className="h-5 w-5 text-tertiary" /> Informasi Vendor Partner
            </h3>

            <div className="space-y-sm">
              <div>
                <p className="text-label-sm text-on-surface-variant uppercase">Nama Vendor</p>
                <p className="text-body-md text-on-surface font-semibold">{split.vendorName || 'Vendor Partner'}</p>
              </div>

              <div>
                <p className="text-label-sm text-on-surface-variant uppercase">ID Kemitraan</p>
                <p className="text-body-md text-on-surface font-mono text-xs">{split.vendorId}</p>
              </div>

              <div className="pt-xs border-t border-outline-variant space-y-sm">
                <div>
                  <p className="text-label-sm text-on-surface-variant uppercase">Metode Integrasi</p>
                  <p className="text-body-sm text-on-surface flex items-center gap-xs mt-0.5">
                    <CreditCard className="h-4 w-4 text-on-surface-variant" /> QRIS Dynamic Merchant (Midtrans)
                  </p>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant uppercase">Settlement PJP Provider</p>
                  <p className="text-body-sm text-on-surface font-semibold mt-0.5">{split.pjpProvider || 'MIDTRANS'}</p>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant uppercase">Status Payout Bank</p>
                  <Badge className={
                    split.settlementStatus === 'COMPLETED'
                      ? 'bg-tertiary-container text-on-tertiary-container'
                      : 'bg-tertiary text-on-tertiary'
                  }>
                    {split.settlementStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
