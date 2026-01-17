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