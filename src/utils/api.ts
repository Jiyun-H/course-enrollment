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
    : `${API_BASE_URL}/courses?`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("강의 목록을 불러오는데 실패했습니다.");
  }

  return response.json();
}

// 수강 신청 제출
export async function submitEnrollment(
  data: EnrollmentFormData,
): Promise<EnrollmentResponse> {
  const response = await fetch(`${API_BASE_URL}/enrollments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    // 에러 응답 처리
    const error = result as ErrorResponse;
    throw error;
  }

  return result;
}
