export type QuestionType = 'text' | 'email' | 'textarea' | 'file' | 'tel' | 'url' | 'radio' | 'number';

export interface Question {
  id: keyof ApplicantData;
  label: string;
  type: QuestionType;
  placeholder: string;
  isOptional?: boolean;
  choices?: string[];
  maxlength?: number;
}

export interface ApplicantData {
  fullName: string;
  email: string;
  phone: string;
  portfolio?: string;
  applicantType: 'Experienced' | 'Fresher' | '';
  // Experienced
  yearOfExperience?: string;
  noticePeriod?: string;
  currentCTC?: string;
  expectedCTC?: string;
  // Fresher
  learningInterests?: string;
  graduationYear?: string;
  aiKnowledge?: string;
  // Common
  city: string;
  // Final
  bio: string;
  resume: File | null;
  photo: File | null;
}