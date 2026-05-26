# 수강 신청 폼 과제(FE-A)

온라인 교육 플랫폼의 3단계 수강 신청 폼을 구현한 프로젝트

---

## 프로젝트 개요

강의 선택 → 신청자 정보 입력 → 확인 및 제출의 3단계 멀티스텝 폼

**주요 기능**

- 3단계 URL 기반 멀티스텝 폼 (`/enrollment/step/1` ~ `/enrollment/step/3`)
- 카테고리 필터 + 페이지네이션이 적용된 강의 목록
- 개인 / 단체 신청 전환 및 단체 참가자 이름·이메일 중복 검증
- 스텝 전환 시 해당 스텝 검증 + 필드 blur 시 개별 검증
- 제출 실패 시 입력 데이터 유지 및 에러 코드별 사용자 메시지 표시
- Zustand persist로 새로고침 이후에도 폼 데이터 자동 복원(다음단계 버튼을 클릭해 입력한 정보가 저장 되었을시)

---

## 기술 스택

| 분류          | 선택                                 |
| ------------- | ------------------------------------ |
| 프레임워크    | Next.js 16 (App Router)              |
| UI 라이브러리 | React 19                             |
| 언어          | TypeScript 5                         |
| 폼 상태 관리  | React Hook Form 7                    |
| 유효성 검증   | Zod 4                                |
| 전역 상태     | Zustand 5                            |
| 스타일링      | Tailwind CSS 4                       |
| API           | Next.js Route Handlers (Mock Server) |

---

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000` 에 접속하면 강의 목록 페이지(Step1)로 리다이렉트

```bash

# 빌드 및 프로덕션 실행
npm run build
npm start
```

---

## 프로젝트 구조 설명

```
src/
├── app/
│   ├── enrollment/
│   │   ├── layout.tsx                 # enrollment 공통 레이아웃
│   │   └── step/[step]/page.tsx       # 동적 라우팅 기반 스텝 페이지
│   ├── api/
│   │   ├── courses/route.ts           # GET /api/courses - 강의 목록 불러오기
│   │   └── enrollments/route.ts       # POST /api/enrollments - 수강 신청 정보 post
│   └── page.tsx                       # 루트 → /enrollment/step/1 첫번째 step으로 리다이렉트
├── components/
│   ├── common/
│   │   ├── Input.tsx                  # 에러 상태 포함 공통 입력 컴포넌트
│   │   ├── Textarea.tsx               # 공통 텍스트에어리어(수강 신청 사유 입력)
│   │   └── StepIndicator.tsx          # 진행 단계 인디케이터
│   └── steps/
│       ├── Step1CourseSelection.tsx
│       ├── Step2StudentInfo.tsx
│       ├── Step3Confirmation.tsx
│       ├── step1/
│       │   ├── CategoryFilter.tsx     # 카테고리 필터 탭
│       │   ├── CourseCard.tsx         # 강의 카드 (정원 상태 시각화)
│       │   ├── EnrollmentTypeSelector.tsx  # 개인/단체 선택
│       │   ├── Pagination.tsx         # 페이지네이션
│       │   └── SelectedCourseInfo.tsx # 선택된 강의 요약 표시
│       ├── step2/
│       │   ├── PersonalForm.tsx       # 개인 신청 폼
│       │   ├── GroupForm.tsx          # 단체 신청 폼
│       │   ├── ApplicationInfoFields.tsx         # 신청자 공통 필드
│       │   └── GroupApplicationInfoFields.tsx    # 단체 신청자 필드
│       └── step3/
│           ├── CourseInfoSummary.tsx  # 선택 강의 요약
│           ├── PersonalInfoSummary.tsx  # 개인 신청 요약
│           ├── GroupInfoSummary.tsx   # 단체 신청 요약
│           ├── TermsAgreement.tsx     # 이용약관 동의
│           └── SuccessScreen.tsx      # 제출 성공 화면
├── stores/
│   └── enrollmentStore.ts             # Zustand 전역 스토어 (persist)
├── types/
│   └── enrollment.ts                  # 도메인 타입 정의
├── utils/
│   ├── validation.ts                  # Zod 스키마 모음
│   ├── api.ts                         # API 호출 함수
│   └── formatters.ts                  # 전화번호 포맷 유틸
└── mocks/
    └── courses.ts                     # 목업 강의 데이터
```

---

## 요구사항 해석 및 가정

### 가정 사항

- 강의 데이터는 목 서버로 대체
- 제출된 신청 데이터는 서버 인메모리 배열에 저장되며, 서버 재시작 시 초기화
- 동일 이메일로 동일 강의에 중복 신청 시 `DUPLICATE_ENROLLMENT` 에러를 반환

### 고민했던 지점과 처리 방식

**단체 → 개인 전환 시 데이터 처리**

단체 관련 데이터(`group` 필드 전체)를 초기화하되, 신청자 공통 정보(이름·이메일·전화번호)는 유지
전환 전 `window.confirm`으로 사용자 의도를 재확인하며, 개인 → 단체 전환 시에도 동일하게 적용

**단체 참가자 이메일·이름 중복 처리**

Zod `superRefine`으로 단체 참가자 배열 전체를 검사하여 중복된 항목의 인덱스에 직접 에러를 추가
첫 번째 항목은 항상 유효한 것으로 보고(단체 신청은 무조건 2인 이상 입력해야 valid한 데이터) 이후 중복 항목에만 에러를 표시합니다. 이름과 이메일은 각각 독립적으로 검사

**정원이 거의 찬 강의 선택 시 **

- 강의 카드(`CourseCard`)에서 잔여 정원 수와 색상으로 상태를 시각화합니다 (여유 - 초록색 / 임박 - 주황색 / 마감 - 붉은색으로 정원 대신 '마감' 텍스트 표시).
- 정원이 마감된 강의는 선택 자체를 비활성화
- 단체 신청 인원이 잔여 정원을 초과하면 스텝2 에서 경고 메시지를 표시
- 최종 정원 초과 여부는 서버에서 재검증하여 `COURSE_FULL` 에러 코드로 응답

**참가자 수(`headCount`)와 `participants` 배열 길이 불일치**

그룹 신청 폼에서 신청자 수 `headCount` 변경 시 참여자 `participants` 배열을 동적으로 생성·축소
인원수를 줄이면 초과 항목이 제거되고, 늘리면 빈 항목이 추가

---

## 설계 결정과 이유

### 1. 폼 상태 관리: React Hook Form + Zustand 역할 분리

React Hook Form은 스텝 내 비제어 컴포넌트 관리와 blur 시점 개별 검증을 담당
Zustand(persist)는 스텝 간 데이터 공유와 새로고침 복원을 담당

스텝 전환 시 React Hook Form이 검증한 데이터만 Zustand에 커밋

해당 구조 선택 이유

- **하나의 Form Instacne**로 전 스텝을 관리하면 스텝별 검증이 복잡
- **스텝별 독립적인 `useState`**만 쓰면 스텝 간 이동 시 데이터가 유실 가능

두 라이브러리의 역할을 분리하여 각 스텝은 가벼운 폼 상태를 갖고, 전역 상태는 Zustand가 보장

### 2. 유효성 검증: Zod discriminated union + 스텝별 schema

`type` 필드를 판별자로 사용하는 discriminated union으로 개인/단체 스키마를 분리
타입 내로잉이 자동으로 이루어져 `group` 필드를 옵셔널 처리하면서도 타입 안전성을 유지 가능

검증은 세 단계로 나뉩니다.

- **필드 blur 시**: React Hook Form `mode: "onBlur"`로 개별 필드 검증
- **스텝 전환 시**: React Hook Form `trigger()`로 현재 스텝 전체 검증
- **제출 직전(스텝 3)**: Zustand에 저장된 최종 데이터를 Zod로 재검증 후 API 호출

### 3. URL 기반 라우팅 (`/enrollment/step/[step]`)

URL 기반 라우팅을 적용하여 브라우저의 뒤로가기/앞으로가기 기능과 완벽하게 호환되며, 사용자가 현재 진행 중인 단계를 직관적으로 파악할 수 있도록 UX 향상

### 4. 컴포넌트 분리 전략

`Step1CourseSelection`, `Step3Confirmation` 등 스텝 컴포넌트는 데이터 흐름을 조율하는 오케스트레이터 역할만 하도록 함
UI 단위(`CourseCard`, `SuccessScreen`, `TermsAgreement` 등)는 별도 컴포넌트로 분리를 통해
각 UI 컴포넌트는 순수하게 props를 받아 렌더링하므로, 스텝 컴포넌트의 로직 변경이 UI에 영향을 주지 않습니다.

### 5. 에러 처리 전략

API 에러 코드(`COURSE_FULL`, `DUPLICATE_ENROLLMENT`, `INVALID_INPUT`, `UNKNOWN_ERROR`)를 코드별로 분기하여 사용자에게 의미 있는 메시지를 표시
제출 실패 시 `isSubmitting` 플래그를 해제하여 재시도를 허용하고, 입력 데이터는 Zustand에 그대로 유지됩니다.

---

## 미구현 / 제약사항

### 미구현 및 제약사항

- 실제 데이터베이스 연동 -> 인메모리 배열로 대체. 서버 재시작 시 신청 데이터가 초기화됩니다.
- 폼 작성 중 이탈 시 데이터 미저장 -> 입력 도중 새로고침이나 브라우저 뒤로가기 시 작성 중인 데이터가 유실될 수 있습니다. 버튼 클릭 시에만 스토어에 동기화되도록 구현되어 있으며, 향후 debounce를 활용한 자동 저장(Auto-save) 기능으로 개선
- 단체 참가자 직접 입력은 UX가 불편할 수 있음 -> 단체 참여자 정보를 csv파일에 입력한 뒤 papaparse 등으로 CSV 파싱 후 배열에 주입하는 방식으로 추후 개선 가능

---

## AI 활용 범위

| 단계                    | AI 활용 내용 (페어 프로그래머 및 사수 역할)                                       | 직접 판단하고 구현한 부분                                                                                 |
| :---------------------- | :-------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| **목업 데이터 생성**    | 강의 목록, 카테고리 등 반복적인 더미 데이터 초안 생성 요청                        | UI 테스트에 필요한 엣지 케이스(정원 마감 임박, 마감 등) 데이터 선별 및 구조화                             |
| **상태 관리 (Zustand)** | Zustand의 기본 사용법 및 보일러플레이트 코드 참고                                 | 프로젝트 흐름에 맞춰 `persist` 미들웨어 적용 및 로컬 스토리지 저장 예외 처리(`partialize`) 직접 구현      |
| **코드 리팩토링 검토**  | 컴포넌트 분리 후 누락된 Props나 로직이 없는지 코드 리뷰 요청                      | AI의 제안을 참고하여 '오케스트레이터 - 하위 UI 컴포넌트'로 구조를 나누는 최종 아키텍처 결정               |
| **에러 디버깅**         | `react-hook-form` 중첩 객체 타입 에러 등 복잡한 타입스크립트 에러 원인 파악       | AI가 편의를 위해 제안한 `any` 사용을 배제하고, 제네릭(`T`)을 활용해 완벽한 타입 안정성 확보               |
| **프로덕션 레벨 설계**  | 실제 실무(프로덕트 레벨)에서의 폼 상태 관리 및 컴포넌트 설계 베스트 프랙티스 질문 | 조언을 바탕으로 URL 기반 라우팅, 스텝 전환 시 유효성 방어 로직 등 실제 UX에 맞는 형태로 커스터마이징 적용 |

**Review Note**
AI는 빠르고 유용한 해결책을 제시하지만, 맥락 없이 `any`를 남발하거나 비즈니스 로직(예: 잔여 정원 검증 등)을 누락하는 경우가 있었습니다. 따라서 AI의 제안을 맹신하지 않고, 프로젝트의 요구사항과 타입 안정성에 맞춰 코드를 직접 수정하고 다듬으며 반영했습니다.
