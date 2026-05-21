export type CourseCategory =
  | "development"
  | "design"
  | "marketing"
  | "business";
export type EnrollmentType = "personal" | "group";

export interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  price: number;
  maxCapacity: number;
  currentEnrollment: number;
  startDate: string;
  endDate: string;
  instructor: string;
}

export interface Participant {
  name: string;
  email: string;
}

export interface Applicant {
  name: string;
  email: string;
  phone: string;
  motivation?: string;
}

export interface GroupInfo {
  organizationName: string;
  headCount: number;
  participants: Participant[];
  contactPerson: string;
}

// 폼 데이터 (전체)
export interface EnrollmentFormData {
  // Step 1
  courseId: string;
  course: Course | null;
  type: EnrollmentType;

  // Step 2
  applicant: Applicant;
  group?: GroupInfo;

  // Step 3
  agreedToTerms: boolean;
}

// API 응답
export interface EnrollmentResponse {
  enrollmentId: string;
  status: "confirmed" | "pending";
  enrolledAt: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, string>;
}

// 스텝 타입
export type Step = 1 | 2 | 3;
