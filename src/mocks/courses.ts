// src/mocks/courses.ts
import { Course } from "@/types/enrollment";

export const mockCourses: Course[] = [
  // Development 카테고리
  {
    id: "dev-001",
    title: "React 마스터 클래스",
    description: "React의 기초부터 고급 패턴까지 완벽 학습",
    category: "development",
    price: 350000,
    maxCapacity: 30,
    currentEnrollment: 12,
    startDate: "2026-06-15T09:00:00Z",
    endDate: "2026-08-15T18:00:00Z",
    instructor: "김민수",
  },
  {
    id: "dev-002",
    title: "TypeScript 완전 정복",
    description: "TypeScript로 안전한 코드 작성하기",
    category: "development",
    price: 280000,
    maxCapacity: 25,
    currentEnrollment: 22,
    startDate: "2026-06-20T09:00:00Z",
    endDate: "2026-07-20T18:00:00Z",
    instructor: "이서준",
  },
  {
    id: "dev-003",
    title: "Next.js 실전 프로젝트",
    description: "풀스택 웹 애플리케이션 개발",
    category: "development",
    price: 420000,
    maxCapacity: 25,
    currentEnrollment: 24, // 거의 마감 (1자리 남음)
    startDate: "2026-07-05T09:00:00Z",
    endDate: "2026-09-05T18:00:00Z",
    instructor: "박지훈",
  },
  {
    id: "dev-004",
    title: "Node.js 백엔드 개발",
    description: "Express와 NestJS로 배우는 서버 개발",
    category: "development",
    price: 380000,
    maxCapacity: 30,
    currentEnrollment: 14,
    startDate: "2026-06-18T09:00:00Z",
    endDate: "2026-08-18T18:00:00Z",
    instructor: "최영호",
  },
  {
    id: "dev-005",
    title: "Python 데이터 분석",
    description: "Pandas와 NumPy로 시작하는 데이터 분석",
    category: "development",
    price: 320000,
    maxCapacity: 35,
    currentEnrollment: 22,
    startDate: "2026-07-15T09:00:00Z",
    endDate: "2026-09-15T18:00:00Z",
    instructor: "정수진",
  },

  // Design 카테고리 - 빈 상태 테스트용 (모든 강의 제거)
  // 이 카테고리를 선택하면 "등록 가능한 강의가 없습니다" 메시지가 표시되어야 합니다.

  // Marketing 카테고리
  {
    id: "mar-001",
    title: "디지털 마케팅 전략",
    description: "SNS부터 검색광고까지",
    category: "marketing",
    price: 300000,
    maxCapacity: 35,
    currentEnrollment: 15,
    startDate: "2026-06-25T09:00:00Z",
    endDate: "2026-08-25T18:00:00Z",
    instructor: "정민지",
  },
  {
    id: "mar-002",
    title: "콘텐츠 마케팅 실전",
    description: "블로그, 유튜브, 인스타그램 마케팅",
    category: "marketing",
    price: 280000,
    maxCapacity: 40,
    currentEnrollment: 28,
    startDate: "2026-07-03T09:00:00Z",
    endDate: "2026-09-03T18:00:00Z",
    instructor: "김서연",
  },
  {
    id: "mar-003",
    title: "퍼포먼스 마케팅",
    description: "광고 캠페인 기획부터 분석까지",
    category: "marketing",
    price: 350000,
    maxCapacity: 30,
    currentEnrollment: 30, // 정원 초과 (COURSE_FULL 에러 테스트용)
    startDate: "2026-06-28T09:00:00Z",
    endDate: "2026-08-28T18:00:00Z",
    instructor: "박준영",
  },
  {
    id: "mar-004",
    title: "브랜드 마케팅 전략",
    description: "브랜드 포지셔닝과 커뮤니케이션",
    category: "marketing",
    price: 320000,
    maxCapacity: 25,
    currentEnrollment: 18,
    startDate: "2026-07-12T09:00:00Z",
    endDate: "2026-09-12T18:00:00Z",
    instructor: "최하윤",
  },

  // Business 카테고리
  {
    id: "bus-001",
    title: "스타트업 경영 실무",
    description: "초기 스타트업 생존 전략",
    category: "business",
    price: 400000,
    maxCapacity: 20,
    currentEnrollment: 5,
    startDate: "2026-07-10T09:00:00Z",
    endDate: "2026-09-10T18:00:00Z",
    instructor: "김태현",
  },
  {
    id: "bus-002",
    title: "재무제표 분석 실무",
    description: "기업 재무제표 읽기와 분석",
    category: "business",
    price: 360000,
    maxCapacity: 25,
    currentEnrollment: 17,
    startDate: "2026-06-16T09:00:00Z",
    endDate: "2026-08-16T18:00:00Z",
    instructor: "이지민",
  },
  {
    id: "bus-003",
    title: "프로젝트 관리 기법",
    description: "애자일과 스크럼 실무 적용",
    category: "business",
    price: 340000,
    maxCapacity: 30,
    currentEnrollment: 21,
    startDate: "2026-07-01T09:00:00Z",
    endDate: "2026-08-31T18:00:00Z",
    instructor: "정현우",
  },
  {
    id: "bus-004",
    title: "비즈니스 모델 설계",
    description: "린 캔버스로 배우는 사업 모델링",
    category: "business",
    price: 380000,
    maxCapacity: 20,
    currentEnrollment: 11,
    startDate: "2026-06-30T09:00:00Z",
    endDate: "2026-08-30T18:00:00Z",
    instructor: "박소영",
  },
  {
    id: "bus-005",
    title: "협상과 계약 실무",
    description: "비즈니스 협상 기술과 계약서 작성",
    category: "business",
    price: 350000,
    maxCapacity: 25,
    currentEnrollment: 25, // 정원 마감 (COURSE_FULL 에러 테스트용)
    startDate: "2026-07-20T09:00:00Z",
    endDate: "2026-09-20T18:00:00Z",
    instructor: "최재훈",
  },
];

export const categories = [
  "development",
  "design",
  "marketing",
  "business",
] as const;

export const categoryLabels: Record<string, string> = {
  development: "개발",
  design: "디자인",
  marketing: "마케팅",
  business: "비즈니스",
};

/**
 * 테스트 시나리오:
 *
 * 1. 빈 상태 테스트
 *    - Design 카테고리 선택 시 → "등록 가능한 강의가 없습니다" 메시지
 *
 * 2. 정원 초과 테스트
 *    - mar-003 (퍼포먼스 마케팅): 30/30 (정원 마감)
 *    - bus-005 (협상과 계약 실무): 25/25 (정원 마감)
 *    - 제출 시 COURSE_FULL 에러 발생
 *
 * 3. 거의 마감 테스트
 *    - dev-003 (Next.js 실전 프로젝트): 24/25 (1자리 남음)
 *    - 단체 신청 시 정원 부족 경고 표시
 *
 * 4. 여유 있는 강의
 *    - bus-001 (스타트업 경영 실무): 5/20 (여유)
 *    - 단체 신청 10명도 가능
 */
