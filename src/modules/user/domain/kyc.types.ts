export enum KycDocumentType {
  PASSPORT = 'PASSPORT',
  DRIVERS_LICENSE = 'DRIVERS_LICENSE',
  ID_CARD = 'ID_CARD',
}

export interface KycSubmissionData {
  firstName: string;
  lastName: string;
  dob: string; // YYYY-MM-DD
  country: string;
  documentType: KycDocumentType;
  documentFront: File | null;
  documentBack?: File | null;
  selfie?: File | null;
}

export interface KycResponse {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  message: string;
}

export interface KycStatusResponse {
  status: 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason: string | null;
}

// NEW: Admin View of a Request
export interface KycRequest {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dob: string;
  country: string;
  documentType: KycDocumentType;
  
  // URLs
  documentFrontUrl: string;
  documentBackUrl?: string;
  selfieUrl?: string;
  
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  createdAt: string;
  
  // Nested User Data
  user: {
    id: string;
    email: string;
    role: string;
    status: string;
    emailVerified: boolean;
  };
}
