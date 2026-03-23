export interface Clinic {
  id: string;
  name: string;
  ownerId: string;
  displayCode: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  clinicId: string;
}

export interface TokenMeta {
  currentToken: number;
  lastToken: number;
}

export interface DisplaySettings {
  bgColor: string;
  textColor: string;
  fontSize: string;
  voiceEnabled: boolean;
  language: string;
}
