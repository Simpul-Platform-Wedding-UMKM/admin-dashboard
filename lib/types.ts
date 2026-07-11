// ============================================================================
// SIMPUL Admin Console - TypeScript Types
// Matches Prisma schema structure exactly
// ============================================================================

// ============================================================================
// ENUMS
// ============================================================================

export enum VendorStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export enum DisputeStatus {
  OPEN = 'OPEN',
  IN_REVIEW = 'IN_REVIEW',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum DisputeResolution {
  BUYER_WIN = 'BUYER_WIN',
  SELLER_WIN = 'SELLER_WIN',
  MUTUAL_AGREEMENT = 'MUTUAL_AGREEMENT',
  WITHDRAWN = 'WITHDRAWN',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum PaymentSplitStatus {
  PENDING = 'PENDING',
  HOLDING = 'HOLDING',
  RELEASED = 'RELEASED',
  FAILED = 'FAILED',
}

export enum SettlementStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum ReviewSentiment {
  POSITIVE = 'POSITIVE',
  NEUTRAL = 'NEUTRAL',
  NEGATIVE = 'NEGATIVE',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum ComplianceCategory {
  VENDOR_VERIFICATION = 'VENDOR_VERIFICATION',
  PAYMENT_SECURITY = 'PAYMENT_SECURITY',
  FRAUD_DETECTION = 'FRAUD_DETECTION',
  DATA_PRIVACY = 'DATA_PRIVACY',
  KYC_REQUIREMENTS = 'KYC_REQUIREMENTS',
}

export enum AuditActionType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  SUSPEND = 'SUSPEND',
}

export enum AccountRole {
  ADMIN = 'ADMIN',
  CONSUMER = 'CONSUMER',
}

// ============================================================================
// CORE TYPES
// ============================================================================

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  region: string;
  address: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
  bankCode: string;
  status: VendorStatus;
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  totalRevenue: number;
  holdingFunds: number;
  suspensionReason?: string;
  kycVerified: boolean;
  kycVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  vendorId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  location: string;
  images: string[];
  isActive: boolean;
  totalBookings: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  projectId: string;
  vendorId: string;
  buyerId: string;
  bookingDate: string;
  serviceDate: string;
  quantity: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface BookingItem {
  id: string;
  bookingId: string;
  vendorId: string;
  itemPrice: number;
  itemName: string;
  quantity: number;
  subtotal: number;
}

export interface PaymentSplit {
  id: string;
  bookingId: string;
  bookingItemId: string;
  vendorId: string;
  grossAmount: number;
  microFeeAmount: number;
  platformFeeAmount: number;
  netAmount: number;
  status: PaymentSplitStatus;
  settlementStatus: SettlementStatus;
  qrisCode?: string;
  qrisExpiresAt?: string;
  transactionId?: string;
  pjpProvider?: string;
  pjpTransactionId?: string;
  releasedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Dispute {
  id: string;
  bookingItemId: string;
  bookingId: string;
  vendorId: string;
  buyerId: string;
  status: DisputeStatus;
  reason: string;
  description: string;
  evidence: string[];
  resolutionType?: DisputeResolution;
  resolutionNotes?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  vendorId: string;
  buyerId: string;
  rating: number;
  sentiment: ReviewSentiment;
  comment: string;
  createdAt: string;
}

export interface AIAnalyticsLog {
  id: string;
  vendorId: string;
  queryType: string;
  topic: string;
  query: string;
  response: string;
  tokensUsed: number;
  confidence: number;
  createdAt: string;
}

export interface FeaturedSlot {
  id: string;
  vendorId: string;
  projectId: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  monthlyFee: number;
  premiumStatus: 'BASIC' | 'PREMIUM' | 'PLATINUM';
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceCheck {
  id: string;
  vendorId: string;
  category: ComplianceCategory;
  status: 'PASSED' | 'FAILED' | 'WARNING';
  riskLevel: RiskLevel;
  description: string;
  findings: string;
  checkedAt: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  actionType: AuditActionType;
  entityType: string;
  entityId: string;
  changes: Record<string, any>;
  ipAddress: string;
  createdAt: string;
}

export interface SystemUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'ANALYST';
  permissions: string[];
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Mirrors the `Account` model in schema.prisma (email, passwordHash, role).
// Admin Console login only allows role === ADMIN.
export interface Account {
  id: string;
  email: string;
  passwordHash: string;
  role: AccountRole;
  name: string;
  createdAt: string;
}

// ============================================================================
// DASHBOARD AGGREGATES
// ============================================================================

export interface DashboardKPI {
  totalGMV: number;
  totalActiveVendors: number;
  totalTransactions: number;
  totalDisputes: number;
  systemHealth: number;
  averageRating: number;
}

export interface ChartData {
  date: string;
  value: number;
  label?: string;
}

export interface VendorMetrics {
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  completionRate: number;
  holdingFunds: number;
  totalBookings: number;
}
