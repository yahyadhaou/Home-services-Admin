// Mirrors the DTO shapes returned by homeservice-backend's admin module
// (src/modules/admin/admin.service.js). Kept as one file since both sides
// of this boundary are maintained together in this monorepo-style layout.

export type ApiEnvelope<T> = { success: true; data: T } | { success: false; error: { message: string; details?: unknown } };

export type Paginated<T> = {
  success: true;
  data: T[];
  pagination: { page: number; limit: number; totalItems: number; totalPages: number };
};

export type ApplicationStatus = "draft" | "pending" | "approved" | "rejected";
export type BookingStatusCode = "pending" | "upcoming" | "in_progress" | "completed" | "cancelled";
export type ProviderType = "company" | "independent";
export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";

export type AdminUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  locale: string;
};

export type UserSummary = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
};

export type Overview = {
  counts: {
    clients: number;
    companies: { total: number; draft: number; pending: number; approved: number; rejected: number };
    independents: { total: number; draft: number; pending: number; approved: number; rejected: number };
    workers: number;
    bookings: {
      total: number;
      pending: number;
      upcoming: number;
      in_progress: number;
      completed: number;
      cancelled: number;
    };
  };
  revenue: {
    totalCollected: number;
    completedBookingsGross: number;
    completedBookingsProviderNet: number;
    platformEarnings: number;
  };
  recentBookings: BookingSummary[];
};

export type CompanySummary = {
  id: string;
  legalName: string;
  city: string;
  postalCode: string;
  applicationStatus: ApplicationStatus;
  owner: UserSummary | null;
  workerCount?: number;
  bookingCount?: number;
  submittedAt: string | null;
  approvedAt: string | null;
  createdAt: string;
};

export type DocumentDTO = {
  id: number;
  type: string;
  fileUrl: string;
  uploadedAt: string;
  verifiedAt: string | null;
};

export type WorkerSummary = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
  isActive?: boolean;
  isAvailable: boolean;
  specialtyCategory?: string;
  company?: { id: string; legalName: string };
  joinedDate: string;
  removedAt?: string | null;
};

export type CompanyDetail = CompanySummary & {
  street: string;
  legalForm?: string;
  commercialRegisterNumber: string | null;
  registerCourt: string | null;
  representativeName: string;
  representativeEmail: string;
  representativePhone: string | null;
  taxNumber: string | null;
  vatId: string | null;
  hourlyRateFrom: number | null;
  vehicleType: string | null;
  vehicleMaxVolumeM3: number | null;
  longHaulCapable: boolean | null;
  crewSize: number | null;
  isInsured: boolean | null;
  payoutOnFile: boolean;
  payoutConsentAt: string | null;
  rejectedReason: string | null;
  workers: WorkerSummary[];
  documents: DocumentDTO[];
  stats: { totalBookings: number; completedBookings: number; totalGross: number; totalProviderNet: number };
};

export type IndependentSummary = {
  id: string;
  businessName: string;
  city: string;
  postalCode: string;
  applicationStatus: ApplicationStatus;
  primaryCategory?: string;
  owner: UserSummary | null;
  bookingCount?: number;
  submittedAt: string | null;
  approvedAt: string | null;
  createdAt: string;
};

export type IndependentDetail = IndependentSummary & {
  street: string;
  legalForm?: string;
  taxNumber: string | null;
  vatId: string | null;
  hourlyRateFrom: number | null;
  vehicleType: string | null;
  vehicleMaxVolumeM3: number | null;
  longHaulCapable: boolean | null;
  crewSize: number | null;
  isInsured: boolean | null;
  payoutOnFile: boolean;
  payoutConsentAt: string | null;
  rejectedReason: string | null;
  documents: DocumentDTO[];
  stats: { totalBookings: number; completedBookings: number; totalGross: number; totalProviderNet: number };
};

export type WorkerDetail = WorkerSummary & {
  email?: string;
  lastLoginAt?: string | null;
  createdAt?: string;
  recentJobs: BookingSummary[];
};

export type ClientSummary = UserSummary & { bookingCount?: number };

export type ClientDetail = UserSummary & {
  hasProfile: boolean;
  totalBookings: number;
  recentBookings: BookingSummary[];
  reviews: ReviewDTO[];
};

export type BookingSummary = {
  id: string;
  bookingNumber: string;
  status: BookingStatusCode;
  category?: string;
  serviceLabel: string;
  providerType: ProviderType;
  provider: { id?: string; name?: string };
  client?: { id: string; name: string };
  assignedWorker: { id: string; name: string } | null;
  scheduledDate: string;
  scheduledTime: string;
  priceGross: number;
  providerEarningNet: number;
  isEmergency: boolean;
  createdAt: string;
};

export type PaymentDTO = {
  id: string;
  booking?: { id: string; bookingNumber: string };
  amountGross: number;
  currency: string;
  status: PaymentStatus;
  method: string | null;
  psp: string;
  processedAt: string | null;
  createdAt: string;
};

export type ReviewDTO = {
  id: string;
  rating: number;
  comment: string | null;
  providerResponse: string | null;
  client?: { id: string; name: string };
  providerType: ProviderType;
  provider: { id?: string; name?: string };
  booking?: { id: string; bookingNumber: string };
  createdAt: string;
};

export type BookingDetail = BookingSummary & {
  address: { street: string; postalCode: string; city: string };
  isRecurring: boolean;
  recurrenceFrequency: string | null;
  cancelledAt: string | null;
  cancelledReason: string | null;
  payments: PaymentDTO[];
  review: ReviewDTO | null;
};
