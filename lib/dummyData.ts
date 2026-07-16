import { 
  Vendor, 
  VendorStatus, 
  PaymentSplit, 
  PaymentSplitStatus, 
  SettlementStatus, 
  Dispute, 
  DisputeStatus,
  AuditLog,
  SystemUser,
  FeaturedSlot,
  AuditActionType,
  ComplianceCheck,
  AIAnalyticsLog,
  ComplianceCategory,
  RiskLevel
} from './types'

// Mock document links (using high-quality placeholders for KTP, NPWP, SIUP, MOU)
export interface ExtendedVendor extends Vendor {
  ktpUrl?: string;
  npwpUrl?: string;
  siupUrl?: string;
  mouUrl?: string;
  rejectionReason?: string;
}

// Initial mock Vendors
const INITIAL_VENDORS: ExtendedVendor[] = [
  {
    id: 'vendor-1',
    name: 'Budi Catering Service',
    email: 'budi.catering@gmail.com',
    phone: '081234567890',
    businessName: 'CV Budi Jaya Kuliner',
    businessType: 'Catering & F&B',
    region: 'Purwokerto',
    address: 'Jl. Jenderal Soedirman No. 12, Purwokerto Timur, Banyumas',
    bankAccountName: 'Budi Harjo',
    bankAccountNumber: '1234567890',
    bankName: 'Bank Central Asia',
    bankCode: 'BCA',
    status: VendorStatus.PENDING,
    averageRating: 4.8,
    totalReviews: 24,
    totalBookings: 32,
    totalRevenue: 45000000,
    holdingFunds: 12000000,
    kycVerified: false,
    createdAt: '2026-06-01T08:00:00Z',
    updatedAt: '2026-06-01T08:00:00Z',
    ktpUrl: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=600', // Mock KTP / ID Card card image
    npwpUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600', // Mock tax card image
    siupUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600', // Mock business permit
    mouUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600', // Mock contract document
  },
  {
    id: 'vendor-2',
    name: 'Rina MUA & Gallery',
    email: 'rina.makeup@yahoo.com',
    phone: '087788990011',
    businessName: 'Rina Beauty Wedding',
    businessType: 'Make-Up Artist',
    region: 'Banyumas',
    address: 'Jl. Gatot Subroto No. 45, Banyumas',
    bankAccountName: 'Rina Kartika',
    bankAccountNumber: '9876543210',
    bankName: 'Bank Mandiri',
    bankCode: 'MANDIRI',
    status: VendorStatus.PENDING,
    averageRating: 4.9,
    totalReviews: 18,
    totalBookings: 20,
    totalRevenue: 28000000,
    holdingFunds: 7000000,
    kycVerified: false,
    createdAt: '2026-06-15T09:30:00Z',
    updatedAt: '2026-06-15T09:30:00Z',
    ktpUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    npwpUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
    siupUrl: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&q=80&w=600',
    mouUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'vendor-3',
    name: 'Satria Decoration',
    email: 'satria.deco@gmail.com',
    phone: '081399887766',
    businessName: 'PT Satria Dekorindo Nusantara',
    businessType: 'Decoration',
    region: 'Sokaraja',
    address: 'Jl. Raya Sokaraja No. 101, Sokaraja, Banyumas',
    bankAccountName: 'Satria Wibowo',
    bankAccountNumber: '5544332211',
    bankName: 'Bank Rakyat Indonesia',
    bankCode: 'BRI',
    status: VendorStatus.ACTIVE,
    averageRating: 4.7,
    totalReviews: 42,
    totalBookings: 50,
    totalRevenue: 120000000,
    holdingFunds: 0,
    kycVerified: true,
    kycVerifiedAt: '2026-05-10T14:22:00Z',
    createdAt: '2026-04-20T10:00:00Z',
    updatedAt: '2026-05-10T14:22:00Z',
    ktpUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
    npwpUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600',
    siupUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600',
    mouUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'vendor-4',
    name: 'Cahaya Photography',
    email: 'cahaya.photo@gmail.com',
    phone: '085877665544',
    businessName: 'CV Cahaya Kreatif Visual',
    businessType: 'Photography',
    region: 'Purbalingga',
    address: 'Jl. Sudirman No. 89, Purbalingga',
    bankAccountName: 'Yanto Cahyadi',
    bankAccountNumber: '4433221100',
    bankName: 'Bank Central Asia',
    bankCode: 'BCA',
    status: VendorStatus.REJECTED,
    averageRating: 4.6,
    totalReviews: 12,
    totalBookings: 15,
    totalRevenue: 30000000,
    holdingFunds: 0,
    kycVerified: false,
    createdAt: '2026-07-01T11:00:00Z',
    updatedAt: '2026-07-03T09:15:00Z',
    rejectionReason: 'Foto KTP buram dan dokumen SIUP kadaluarsa',
    ktpUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
    npwpUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
    siupUrl: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&q=80&w=600',
    mouUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600',
  }
];

// Mock Transactions (with GPS lat/long for Zonasi check)
export interface ExtendedPaymentSplit extends PaymentSplit {
  checkoutLatitude?: number;
  checkoutLongitude?: number;
  eventLatitude?: number;
  eventLongitude?: number;
  vendorName?: string;
  bookingTitle?: string;
}

const INITIAL_SPLITS: ExtendedPaymentSplit[] = [
  {
    id: 'split-1',
    bookingId: 'booking-1',
    bookingItemId: 'item-1',
    vendorId: 'vendor-3',
    vendorName: 'Satria Decoration',
    bookingTitle: 'Rustic Wedding Backdrop Decoration',
    grossAmount: 15000000,
    microFeeAmount: 75000,    // 0.5%
    platformFeeAmount: 150000, // 1%
    netAmount: 14775000,
    status: PaymentSplitStatus.RELEASED,
    settlementStatus: SettlementStatus.COMPLETED,
    qrisCode: 'qris_code_dummy_1',
    transactionId: 'trx-101',
    pjpProvider: 'MIDTRANS',
    pjpTransactionId: 'mid-trx-001',
    releasedAt: '2026-07-10T18:00:00Z',
    createdAt: '2026-07-09T09:00:00Z',
    updatedAt: '2026-07-10T18:00:00Z',
    // GPS check: radius deviation is small (OK - 40 meters)
    eventLatitude: -7.4244,
    eventLongitude: 109.2301,
    checkoutLatitude: -7.4241,
    checkoutLongitude: 109.2303,
  },
  {
    id: 'split-2',
    bookingId: 'booking-2',
    bookingItemId: 'item-2',
    vendorId: 'vendor-1',
    vendorName: 'Budi Catering Service',
    bookingTitle: 'Buffet Package for 500 Guests',
    grossAmount: 35000000,
    microFeeAmount: 175000,
    platformFeeAmount: 350000,
    netAmount: 34475000,
    status: PaymentSplitStatus.HOLDING,
    settlementStatus: SettlementStatus.PENDING,
    qrisCode: 'qris_code_dummy_2',
    transactionId: 'trx-102',
    pjpProvider: 'MIDTRANS',
    pjpTransactionId: 'mid-trx-002',
    createdAt: '2026-07-14T10:00:00Z',
    updatedAt: '2026-07-14T10:00:00Z',
    // GPS check: radius deviation is huge (Fraud Warning! ~6.3 km)
    eventLatitude: -7.4244,
    eventLongitude: 109.2301,
    checkoutLatitude: -7.4800,
    checkoutLongitude: 109.2800,
  }
];

// Initial mock Disputes
const INITIAL_DISPUTES: Dispute[] = [
  {
    id: 'disp-1',
    bookingId: 'booking-2',
    bookingItemId: 'item-2',
    vendorId: 'vendor-1',
    buyerId: 'buyer-99',
    status: DisputeStatus.OPEN,
    reason: 'Wanprestasi Vendor',
    description: 'Menu makanan utama (rendang dan ikan bakar) terlambat disajikan hingga 2 jam. Tamu undangan banyak yang belum sempat makan ketika acara dimulai.',
    evidence: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600'
    ],
    createdAt: '2026-07-15T12:00:00Z',
    updatedAt: '2026-07-15T12:00:00Z',
  }
];

// Initial mock Audit Logs
const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-1',
    adminId: 'usr-1',
    actionType: AuditActionType.APPROVE,
    entityType: 'VENDOR',
    entityId: 'vendor-3',
    changes: { status: 'ACTIVE' },
    ipAddress: '192.168.100.12',
    createdAt: '2026-07-16T10:00:00Z'
  },
  {
    id: 'audit-2',
    adminId: 'usr-2',
    actionType: AuditActionType.UPDATE,
    entityType: 'DISPUTE',
    entityId: 'disp-1',
    changes: { status: 'IN_REVIEW' },
    ipAddress: '192.168.100.15',
    createdAt: '2026-07-16T11:00:00Z'
  },
  {
    id: 'audit-3',
    adminId: 'usr-1',
    actionType: AuditActionType.REJECT,
    entityType: 'VENDOR',
    entityId: 'vendor-4',
    changes: { status: 'REJECTED' },
    ipAddress: '192.168.100.12',
    createdAt: '2026-07-15T09:15:00Z'
  }
];

// Initial mock System Users
const INITIAL_USERS: SystemUser[] = [
  {
    id: 'usr-1',
    email: 'superadmin@simpul.com',
    name: 'Alif Pratama',
    role: 'SUPER_ADMIN',
    permissions: ['ALL'],
    isActive: true,
    lastLoginAt: '2026-07-16T08:00:00Z',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-07-16T08:00:00Z'
  },
  {
    id: 'usr-2',
    email: 'verifikator@simpul.com',
    name: 'Dewi Lestari',
    role: 'ADMIN',
    permissions: ['VENDOR_VERIFICATION'],
    isActive: true,
    lastLoginAt: '2026-07-16T09:00:00Z',
    createdAt: '2026-02-15T00:00:00Z',
    updatedAt: '2026-07-16T09:00:00Z'
  },
  {
    id: 'usr-3',
    email: 'moderator@simpul.com',
    name: 'Faisal Reza',
    role: 'MODERATOR',
    permissions: ['DISPUTE_RESOLUTION'],
    isActive: true,
    lastLoginAt: '2026-07-15T15:30:00Z',
    createdAt: '2026-03-10T00:00:00Z',
    updatedAt: '2026-07-15T15:30:00Z'
  },
  {
    id: 'usr-4',
    email: 'analis@simpul.com',
    name: 'Gita Amalia',
    role: 'ANALYST',
    permissions: ['ANALYTICS_VIEW'],
    isActive: false,
    lastLoginAt: '2026-07-10T11:00:00Z',
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-07-10T11:00:00Z'
  }
];

// Initial mock Featured Slots (Pemasaran & Slot Unggulan)
const INITIAL_FEATURED_SLOTS: FeaturedSlot[] = [
  {
    id: 'slot-1',
    vendorId: 'vendor-3', // Satria Decoration
    projectId: 'proj-1',
    isActive: true,
    startDate: '2026-07-01T00:00:00Z',
    endDate: '2026-07-31T00:00:00Z',
    monthlyFee: 1500000,
    premiumStatus: 'PLATINUM' as any,
    createdAt: '2026-06-25T00:00:00Z',
    updatedAt: '2026-06-25T00:00:00Z'
  },
  {
    id: 'slot-2',
    vendorId: 'vendor-1', // Budi Catering
    projectId: 'proj-2',
    isActive: true,
    startDate: '2026-07-10T00:00:00Z',
    endDate: '2026-08-10T00:00:00Z',
    monthlyFee: 750000,
    premiumStatus: 'PREMIUM' as any,
    createdAt: '2026-07-09T00:00:00Z',
    updatedAt: '2026-07-09T00:00:00Z'
  }
];

// Initial mock Compliance Checks
const INITIAL_COMPLIANCE_CHECKS: ComplianceCheck[] = [
  {
    id: 'chk-1',
    vendorId: 'vendor-3',
    category: ComplianceCategory.VENDOR_VERIFICATION,
    status: 'PASSED' as any,
    riskLevel: RiskLevel.LOW,
    description: 'Pemeriksaan dokumen identitas KTP pemilik CV dan nomor legalitas SIUP terverifikasi resmi oleh Kementerian Hukum dan HAM.',
    findings: 'Semua dokumen identitas KTP dan SIUP cocok dengan data pendaftaran. Tidak ditemukan riwayat tuntutan hukum.',
    checkedAt: '2026-07-16T10:00:00Z',
    createdAt: '2026-07-16T10:00:00Z'
  },
  {
    id: 'chk-2',
    vendorId: 'vendor-1',
    category: ComplianceCategory.FRAUD_DETECTION,
    status: 'WARNING' as any,
    riskLevel: RiskLevel.HIGH,
    description: 'Deteksi anomali pemindaian QRIS berjarak jauh dari lokasi pernikahan pengantin (selisih radius 6.3 km).',
    findings: 'Pemindaian QRIS terdeteksi di luar zona wilayah Purwokerto Timur (Banyumas). Direkomendasikan untuk menahan payout bagi hasil.',
    checkedAt: '2026-07-16T15:30:00Z',
    createdAt: '2026-07-16T15:30:00Z'
  },
  {
    id: 'chk-3',
    vendorId: 'vendor-2',
    category: ComplianceCategory.KYC_REQUIREMENTS,
    status: 'WARNING' as any,
    riskLevel: RiskLevel.MEDIUM,
    description: 'Verifikasi dokumen wajib pendaftaran rekening dan NPWP badan usaha vendor.',
    findings: 'NPWP belum mengunggah salinan dokumen fisik legalitas. Verifikasi tertahan status pending.',
    checkedAt: '2026-07-16T09:15:00Z',
    createdAt: '2026-07-16T09:15:00Z'
  }
];

// Initial mock AI Analytics Logs
const INITIAL_AI_ANALYTICS_LOGS: AIAnalyticsLog[] = [
  {
    id: 'log-1',
    vendorId: 'vendor-3',
    queryType: 'FAQ_BOT',
    topic: 'Ketentuan Bagi Hasil Platform',
    query: 'Bagaimana pembagian potongan komisi 1% platform fee dan 0.5% micro-fee dari total gross transaksi?',
    response: 'Platform SIMPUL mengenakan potongan otomatis bagi hasil sebesar 1.5% dari gross transaksi (1% sebagai Platform Fee dan 0.5% sebagai PJP Micro-fee). Vendor akan menerima sisa 98.5% sebagai Net Amount yang langsung ditransfer setelah status event dikonfirmasi selesai.',
    tokensUsed: 280,
    confidence: 0.96,
    createdAt: '2026-07-16T08:15:00Z'
  },
  {
    id: 'log-2',
    vendorId: 'vendor-1',
    queryType: 'RECOMMENDATION',
    topic: 'Prediksi Paket Populer',
    query: 'Rekomendasikan strategi promosi paket katering dengan menu rendang untuk wilayah kecamatan Baturraden.',
    response: 'Berdasarkan data peta panas QRIS, kecamatan Baturraden memiliki total volume transaksi Rp75.000.000 dengan minat tinggi pada kategori katering prasmanan. Direkomendasikan mengaktifkan promosi slot unggulan premium untuk menjangkau pengantin baru di region ini.',
    tokensUsed: 390,
    confidence: 0.89,
    createdAt: '2026-07-15T14:40:00Z'
  },
  {
    id: 'log-3',
    vendorId: 'vendor-2',
    queryType: 'FAQ_BOT',
    topic: 'Metode Pengajuan Dispute',
    query: 'Bagaimana cara menanggapi keluhan pengantin jika layanan MUA terlambat?',
    response: 'Jika pengantin mengajukan dispute sengketa, Anda dapat membuka halaman Resolusi Sengketa di dasbor admin untuk mengunggah berkas bantahan/bukti chat. Dana pembayaran akan ditahan sementara di penampungan rekening bersama.',
    tokensUsed: 310,
    confidence: 0.92,
    createdAt: '2026-07-14T11:00:00Z'
  }
];



// ponytail: Helper to get item from local storage or fallback to default
// Known limit: Client-side only. Standard mock fallback on server rendering.
function getStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading key ${key} from localStorage:`, e);
    return fallback;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing key ${key} to localStorage:`, e);
  }
}

// Local Database Interface
class LocalDatabase {
  get vendors(): ExtendedVendor[] {
    return getStorageItem('simpul_mock_vendors', INITIAL_VENDORS);
  }
  set vendors(data: ExtendedVendor[]) {
    setStorageItem('simpul_mock_vendors', data);
  }

  get splits(): ExtendedPaymentSplit[] {
    return getStorageItem('simpul_mock_splits', INITIAL_SPLITS);
  }
  set splits(data: ExtendedPaymentSplit[]) {
    setStorageItem('simpul_mock_splits', data);
  }

  get disputes(): Dispute[] {
    return getStorageItem('simpul_mock_disputes', INITIAL_DISPUTES);
  }
  set disputes(data: Dispute[]) {
    setStorageItem('simpul_mock_disputes', data);
  }

  get auditLogs(): AuditLog[] {
    return getStorageItem('simpul_mock_audit_logs', INITIAL_AUDIT_LOGS);
  }
  set auditLogs(data: AuditLog[]) {
    setStorageItem('simpul_mock_audit_logs', data);
  }

  get users(): SystemUser[] {
    return getStorageItem('simpul_mock_system_users', INITIAL_USERS);
  }
  set users(data: SystemUser[]) {
    setStorageItem('simpul_mock_system_users', data);
  }

  get featuredSlots(): FeaturedSlot[] {
    return getStorageItem('simpul_mock_featured_slots', INITIAL_FEATURED_SLOTS);
  }
  set featuredSlots(data: FeaturedSlot[]) {
    setStorageItem('simpul_mock_featured_slots', data);
  }

  get complianceChecks(): ComplianceCheck[] {
    return getStorageItem('simpul_mock_compliance_checks', INITIAL_COMPLIANCE_CHECKS);
  }
  set complianceChecks(data: ComplianceCheck[]) {
    setStorageItem('simpul_mock_compliance_checks', data);
  }

  get aiAnalyticsLogs(): AIAnalyticsLog[] {
    return getStorageItem('simpul_mock_ai_analytics_logs', INITIAL_AI_ANALYTICS_LOGS);
  }
  set aiAnalyticsLogs(data: AIAnalyticsLog[]) {
    setStorageItem('simpul_mock_ai_analytics_logs', data);
  }
}

export const db = new LocalDatabase();

// API simulation helper methods
export const dummyDb = {
  // Vendor Services
  getVendors: (): ExtendedVendor[] => {
    return db.vendors;
  },

  getVendorById: (id: string): ExtendedVendor | undefined => {
    return db.vendors.find(v => v.id === id);
  },

  updateVendor: (id: string, data: Partial<ExtendedVendor>): ExtendedVendor => {
    const list = db.vendors;
    const idx = list.findIndex(v => v.id === id);
    if (idx === -1) throw new Error('Vendor not found');
    
    const updated = {
      ...list[idx],
      ...data,
      updatedAt: new Date().toISOString()
    };
    list[idx] = updated;
    db.vendors = list;
    return updated;
  },

  // Payment Splits / Revenue Splits
  getPaymentSplits: (): ExtendedPaymentSplit[] => {
    return db.splits;
  },

  getPaymentSplitById: (id: string): ExtendedPaymentSplit | undefined => {
    return db.splits.find(s => s.id === id);
  },

  updatePaymentSplit: (id: string, data: Partial<ExtendedPaymentSplit>): ExtendedPaymentSplit => {
    const list = db.splits;
    const idx = list.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Split not found');

    const updated = {
      ...list[idx],
      ...data,
      updatedAt: new Date().toISOString()
    };
    list[idx] = updated;
    db.splits = list;
    return updated;
  },

  // Dispute Services
  getDisputes: (): Dispute[] => {
    return db.disputes;
  },

  getDisputeById: (id: string): Dispute | undefined => {
    return db.disputes.find(d => d.id === id);
  },

  updateDispute: (id: string, data: Partial<Dispute>): Dispute => {
    const list = db.disputes;
    const idx = list.findIndex(d => d.id === id);
    if (idx === -1) throw new Error('Dispute not found');

    const updated = {
      ...list[idx],
      ...data,
      updatedAt: new Date().toISOString()
    };
    list[idx] = updated;
    db.disputes = list;
    return updated;
  },

  // Audit Logs
  getAuditLogs: (): AuditLog[] => {
    return db.auditLogs;
  },

  // System Users
  getSystemUsers: (): SystemUser[] => {
    return db.users;
  },

  // Featured Slots
  getFeaturedSlots: (): FeaturedSlot[] => {
    return db.featuredSlots;
  },

  // Compliance Checks
  getComplianceChecks: (): ComplianceCheck[] => {
    return db.complianceChecks;
  },

  // AI Analytics Logs
  getAIAnalyticsLogs: (): AIAnalyticsLog[] => {
    return db.aiAnalyticsLogs;
  },

  // Heatmap Services
  getHeatmapData: (): HeatmapPoint[] => {
    return HEATMAP_DATA;
  }
};

export interface HeatmapPoint {
  id: string;
  kecamatan: string;
  latitude: number;
  longitude: number;
  amount: number;
  count: number;
}

// Coordinate mappings for all 27 Kecamatan in Kabupaten Banyumas
const HEATMAP_DATA: HeatmapPoint[] = [
  { id: 'h-1', kecamatan: 'Kecamatan Ajibarang', latitude: -7.4086, longitude: 109.0719, amount: 45000000, count: 9 },
  { id: 'h-2', kecamatan: 'Kecamatan Banyumas', latitude: -7.5186, longitude: 109.2964, amount: 32000000, count: 7 },
  { id: 'h-3', kecamatan: 'Kecamatan Baturraden', latitude: -7.3036, longitude: 109.2272, amount: 75000000, count: 18 },
  { id: 'h-4', kecamatan: 'Kecamatan Cilongok', latitude: -7.4111, longitude: 109.1389, amount: 28000000, count: 6 },
  { id: 'h-5', kecamatan: 'Kecamatan Gumelar', latitude: -7.3750, longitude: 109.0069, amount: 15000000, count: 3 },
  { id: 'h-6', kecamatan: 'Kecamatan Jatilawang', latitude: -7.5361, longitude: 109.1236, amount: 22000000, count: 5 },
  { id: 'h-7', kecamatan: 'Kecamatan Kalibagor', latitude: -7.4694, longitude: 109.3097, amount: 19000000, count: 4 },
  { id: 'h-8', kecamatan: 'Kecamatan Karanglewas', latitude: -7.4125, longitude: 109.2042, amount: 34000000, count: 8 },
  { id: 'h-9', kecamatan: 'Kecamatan Kebasen', latitude: -7.5278, longitude: 109.2236, amount: 12000000, count: 3 },
  { id: 'h-10', kecamatan: 'Kecamatan Kedungbanteng', latitude: -7.3875, longitude: 109.2139, amount: 48000000, count: 10 },
  { id: 'h-11', kecamatan: 'Kecamatan Kembaran', latitude: -7.4167, longitude: 109.2889, amount: 53000000, count: 12 },
  { id: 'h-12', kecamatan: 'Kecamatan Kemranjen', latitude: -7.6083, longitude: 109.3208, amount: 29000000, count: 6 },
  { id: 'h-13', kecamatan: 'Kecamatan Lumbir', latitude: -7.4847, longitude: 108.9736, amount: 11000000, count: 2 },
  { id: 'h-14', kecamatan: 'Kecamatan Patikraja', latitude: -7.4819, longitude: 109.2292, amount: 62000000, count: 15 },
  { id: 'h-15', kecamatan: 'Kecamatan Pekuncen', latitude: -7.3514, longitude: 109.0819, amount: 24000000, count: 5 },
  { id: 'h-16', kecamatan: 'Kecamatan Purwojati', latitude: -7.4819, longitude: 109.1417, amount: 16000000, count: 4 },
  { id: 'h-17', kecamatan: 'Kecamatan Purwokerto Barat', latitude: -7.4194, longitude: 109.2158, amount: 89000000, count: 22 },
  { id: 'h-18', kecamatan: 'Kecamatan Purwokerto Selatan', latitude: -7.4528, longitude: 109.2319, amount: 125000000, count: 35 },
  { id: 'h-19', kecamatan: 'Kecamatan Purwokerto Timur', latitude: -7.4284, longitude: 109.2483, amount: 185000000, count: 48 },
  { id: 'h-20', kecamatan: 'Kecamatan Purwokerto Utara', latitude: -7.3986, longitude: 109.2431, amount: 98000000, count: 26 },
  { id: 'h-21', kecamatan: 'Kecamatan Rawalo', latitude: -7.5250, longitude: 109.1556, amount: 37000000, count: 9 },
  { id: 'h-22', kecamatan: 'Kecamatan Sokaraja', latitude: -7.4589, longitude: 109.2892, amount: 142000000, count: 32 },
  { id: 'h-23', kecamatan: 'Kecamatan Somagede', latitude: -7.5306, longitude: 109.3486, amount: 18000000, count: 4 },
  { id: 'h-24', kecamatan: 'Kecamatan Sumbang', latitude: -7.3589, longitude: 109.2847, amount: 41000000, count: 11 },
  { id: 'h-25', kecamatan: 'Kecamatan Sumpiuh', latitude: -7.6139, longitude: 109.3625, amount: 67000000, count: 16 },
  { id: 'h-26', kecamatan: 'Kecamatan Tambak', latitude: -7.6194, longitude: 109.4125, amount: 31000000, count: 8 },
  { id: 'h-27', kecamatan: 'Kecamatan Wangon', latitude: -7.5028, longitude: 109.0556, amount: 59000000, count: 13 }
];
