// src/utils/api.ts
import {
  Course,
  EnrollmentFormData,
  EnrollmentResponse,
  ErrorResponse,
} from "@/types/enrollment";

const API_BASE_URL = "/api";

// 강의 목록 조회
export async function fetchCourses(category?: string): Promise<{
  courses: Course[];
  categories: string[];
}> {
  const url = category
    ? `${API_BASE_URL}/courses?category=${category}`
    : `${API_BASE_URL}/courses`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("강의 목록을 불러오는데 실패했습니다.");
  }

  return response.json();
}

// 수강 신청 제출
export async function submitEnrollment(
  formData: EnrollmentFormData & { agreedToTerms: boolean },
): Promise<EnrollmentResponse> {
  if (!formData.course) {
    throw {
      code: "INVALID_INPUT",
      message: "강의 정보가 없습니다.",
    } as ErrorResponse;
  }

  if (!formData.applicant) {
    throw {
      code: "INVALID_INPUT",
      message: "신청자 정보가 없습니다.",
    } as ErrorResponse;
  }

  if (formData.type === "group" && !formData.group) {
    throw {
      code: "INVALID_INPUT",
      message: "단체 정보가 없습니다.",
    } as ErrorResponse;
  }

  const requestBody =
    formData.type === "personal"
      ? {
          courseId: formData.course.id,
          courseCurrentEnrollment: formData.course.currentEnrollment,
          courseMaxCapacity: formData.course.maxCapacity,
          type: "personal" as const,
          applicant: {
            name: formData.applicant.name,
            email: formData.applicant.email,
            phone: formData.applicant.phone,
            ...(formData.applicant.motivation && {
              motivation: formData.applicant.motivation,
            }),
          },
          agreedToTerms: formData.agreedToTerms,
        }
      : {
          courseId: formData.course.id,
          courseCurrentEnrollment: formData.course.currentEnrollment,
          courseMaxCapacity: formData.course.maxCapacity,
          type: "group" as const,
          applicant: {
            name: formData.applicant.name,
            email: formData.applicant.email,
            phone: formData.applicant.phone,
            ...(formData.applicant.motivation && {
              motivation: formData.applicant.motivation,
            }),
          },
          group: {
            organizationName: formData.group!.organizationName,
            headCount: formData.group!.headCount,
            participants: formData.group!.participants,
            contactPerson: formData.group!.contactPerson,
          },
          agreedToTerms: formData.agreedToTerms,
        };

  const response = await fetch(`${API_BASE_URL}/enrollments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const result = await response.json();

  if (!response.ok) {
    const error = result as ErrorResponse;
    throw error;
  }

  return result;
}
