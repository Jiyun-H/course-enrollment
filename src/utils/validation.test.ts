import { describe, it, expect } from "vitest";
import {
  applicantSchema,
  groupInfoSchema,
  step2FormSchema,
} from "./validation";

// --- fixtures ---

const validApplicant = {
  name: "홍길동",
  email: "test@example.com",
  phone: "010-1234-5678",
};

const KOREAN_NAMES = [
  "홍길동", "김철수", "이영희", "박민준", "최서연",
  "정예준", "강지우", "조하은", "윤시우", "장수아",
];

const validGroupInfo = {
  organizationName: "테스트 단체",
  headCount: 3,
  participants: [
    { name: "홍길동", email: "hong@example.com" },
    { name: "김철수", email: "kim@example.com" },
    { name: "이영희", email: "lee@example.com" },
  ],
  contactPerson: "010-9876-5432",
};

// --- helpers ---

type AnyParseResult =
  | { success: true }
  | { success: false; error: { issues: { path: (string | number)[]; message: string }[] } };

function getIssues(result: AnyParseResult) {
  return result.success ? [] : result.error.issues;
}

function issueAt(result: AnyParseResult, ...path: (string | number)[]) {
  return getIssues(result).find(
    (i) => i.path.length === path.length && path.every((p, idx) => i.path[idx] === p),
  );
}

// -------------------------------------------------------------------
// applicantSchema
// -------------------------------------------------------------------

describe("applicantSchema", () => {
  describe("이름(name)", () => {
    it.each([
      ["홍길동", true],
      ["김민", true],        // 한글 2자 최소값
      ["John", true],        // 영어
      ["John Doe", true],    // 영어 + 공백
    ])("'%s' → success: %s", (name, expected) => {
      expect(applicantSchema.safeParse({ ...validApplicant, name }).success).toBe(expected);
    });

    it("한글 1자 → 실패 (min 2)", () => {
      expect(applicantSchema.safeParse({ ...validApplicant, name: "홍" }).success).toBe(false);
    });

    it("영어 1자 → 실패 (min 2)", () => {
      expect(applicantSchema.safeParse({ ...validApplicant, name: "A" }).success).toBe(false);
    });

    it("한글 21자 → 실패 (koreanNameRegex max 20)", () => {
      expect(applicantSchema.safeParse({ ...validApplicant, name: "가".repeat(21) }).success).toBe(false);
    });

    it("숫자 포함 → 실패", () => {
      expect(applicantSchema.safeParse({ ...validApplicant, name: "홍길123" }).success).toBe(false);
    });

    it("특수문자 포함 → 실패", () => {
      expect(applicantSchema.safeParse({ ...validApplicant, name: "홍@길동" }).success).toBe(false);
    });

    it("한글+영어 혼합 → 실패", () => {
      expect(applicantSchema.safeParse({ ...validApplicant, name: "홍John" }).success).toBe(false);
    });
  });

  describe("전화번호(phone)", () => {
    it.each([
      ["010-1234-5678"],   // 하이픈 포함
      ["01012345678"],     // 하이픈 없음
      ["010-123-4567"],    // 가운데 3자리
      ["010 1234 5678"],   // 공백 → transform 후 유효
    ])("'%s' → 통과", (phone) => {
      expect(applicantSchema.safeParse({ ...validApplicant, phone }).success).toBe(true);
    });

    it.each([
      ["02-1234-5678"],    // 지역번호
      ["010-12-5678"],     // 가운데 2자리
      ["010-1234-567"],    // 끝 3자리
      [""],                // 빈 문자열
    ])("'%s' → 실패", (phone) => {
      expect(applicantSchema.safeParse({ ...validApplicant, phone }).success).toBe(false);
    });
  });

  describe("이메일(email)", () => {
    it("유효한 이메일 → 통과", () => {
      expect(applicantSchema.safeParse({ ...validApplicant, email: "user@example.com" }).success).toBe(true);
    });

    it.each([
      ["notanemail"],
      ["test@"],
      ["@example.com"],
      [""],
    ])("'%s' → 실패", (email) => {
      expect(applicantSchema.safeParse({ ...validApplicant, email }).success).toBe(false);
    });
  });

  describe("수강 동기(motivation)", () => {
    it("필드 없어도 통과 (optional)", () => {
      const { ...data } = validApplicant;
      expect(applicantSchema.safeParse(data).success).toBe(true);
    });

    it("300자 → 통과 (경계값)", () => {
      expect(applicantSchema.safeParse({ ...validApplicant, motivation: "a".repeat(300) }).success).toBe(true);
    });

    it("301자 → 실패", () => {
      expect(applicantSchema.safeParse({ ...validApplicant, motivation: "a".repeat(301) }).success).toBe(false);
    });
  });
});

// -------------------------------------------------------------------
// groupInfoSchema
// -------------------------------------------------------------------

describe("groupInfoSchema", () => {
  describe("기본 필드 검증", () => {
    it("유효한 단체 정보 → 통과", () => {
      expect(groupInfoSchema.safeParse(validGroupInfo).success).toBe(true);
    });

    it("단체명 빈 문자열 → 실패", () => {
      expect(groupInfoSchema.safeParse({ ...validGroupInfo, organizationName: "" }).success).toBe(false);
    });

    it("단체명 51자 → 실패 (max 50)", () => {
      expect(groupInfoSchema.safeParse({ ...validGroupInfo, organizationName: "가".repeat(51) }).success).toBe(false);
    });

    it("headCount 1 → 실패 (min 2)", () => {
      expect(groupInfoSchema.safeParse({ ...validGroupInfo, headCount: 1 }).success).toBe(false);
    });

    it("headCount 11 → 실패 (max 10)", () => {
      expect(groupInfoSchema.safeParse({ ...validGroupInfo, headCount: 11 }).success).toBe(false);
    });

    it("headCount 2 → 통과 (하한 경계값)", () => {
      const group = {
        ...validGroupInfo,
        headCount: 2,
        participants: [
          { name: "홍길동", email: "p1@example.com" },
          { name: "김철수", email: "p2@example.com" },
        ],
      };
      expect(groupInfoSchema.safeParse(group).success).toBe(true);
    });

    it("headCount 10 → 통과 (상한 경계값)", () => {
      const group = {
        ...validGroupInfo,
        headCount: 10,
        participants: KOREAN_NAMES.map((name, i) => ({
          name,
          email: `p${i}@example.com`,
        })),
      };
      expect(groupInfoSchema.safeParse(group).success).toBe(true);
    });
  });

  describe("이메일 중복 검증 (superRefine)", () => {
    it("중복 이메일 → 두 번째 항목에 에러", () => {
      const result = groupInfoSchema.safeParse({
        ...validGroupInfo,
        participants: [
          { name: "홍길동", email: "same@example.com" },
          { name: "김철수", email: "same@example.com" },
          { name: "이영희", email: "other@example.com" },
        ],
      });
      expect(result.success).toBe(false);
      expect(issueAt(result, "participants", 1, "email")?.message).toBe("중복된 이메일입니다");
    });

    it("이메일 대소문자 무시하고 중복 감지", () => {
      const result = groupInfoSchema.safeParse({
        ...validGroupInfo,
        participants: [
          { name: "홍길동", email: "Test@Example.com" },
          { name: "김철수", email: "test@example.com" },
          { name: "이영희", email: "other@example.com" },
        ],
      });
      expect(result.success).toBe(false);
      expect(issueAt(result, "participants", 1, "email")?.message).toBe("중복된 이메일입니다");
    });

    it("첫 번째 항목에는 중복 에러 없음", () => {
      const result = groupInfoSchema.safeParse({
        ...validGroupInfo,
        participants: [
          { name: "홍길동", email: "same@example.com" },
          { name: "김철수", email: "same@example.com" },
          { name: "이영희", email: "other@example.com" },
        ],
      });
      expect(issueAt(result, "participants", 0, "email")).toBeUndefined();
    });

    it("세 항목 모두 중복 → 두 번째·세 번째에 에러", () => {
      const result = groupInfoSchema.safeParse({
        ...validGroupInfo,
        participants: [
          { name: "홍길동", email: "same@example.com" },
          { name: "김철수", email: "same@example.com" },
          { name: "이영희", email: "same@example.com" },
        ],
      });
      expect(issueAt(result, "participants", 1, "email")?.message).toBe("중복된 이메일입니다");
      expect(issueAt(result, "participants", 2, "email")?.message).toBe("중복된 이메일입니다");
    });
  });

  describe("이름 중복 검증 (superRefine)", () => {
    it("중복 이름 → 두 번째 항목에 에러", () => {
      const result = groupInfoSchema.safeParse({
        ...validGroupInfo,
        participants: [
          { name: "홍길동", email: "a@example.com" },
          { name: "홍길동", email: "b@example.com" },
          { name: "이영희", email: "c@example.com" },
        ],
      });
      expect(result.success).toBe(false);
      expect(issueAt(result, "participants", 1, "name")?.message).toBe("중복된 이름입니다");
    });

    it("영어 이름 대소문자 무시하고 중복 감지", () => {
      const result = groupInfoSchema.safeParse({
        ...validGroupInfo,
        participants: [
          { name: "John", email: "a@example.com" },
          { name: "john", email: "b@example.com" },
          { name: "이영희", email: "c@example.com" },
        ],
      });
      expect(result.success).toBe(false);
      expect(issueAt(result, "participants", 1, "name")?.message).toBe("중복된 이름입니다");
    });

    it("이름과 이메일 동시 중복 → 각각 에러", () => {
      const result = groupInfoSchema.safeParse({
        ...validGroupInfo,
        participants: [
          { name: "홍길동", email: "same@example.com" },
          { name: "홍길동", email: "same@example.com" },
          { name: "이영희", email: "c@example.com" },
        ],
      });
      expect(result.success).toBe(false);
      expect(issueAt(result, "participants", 1, "name")?.message).toBe("중복된 이름입니다");
      expect(issueAt(result, "participants", 1, "email")?.message).toBe("중복된 이메일입니다");
    });
  });
});

// -------------------------------------------------------------------
// step2FormSchema (discriminated union)
// -------------------------------------------------------------------

describe("step2FormSchema", () => {
  describe("개인 신청 (type: personal)", () => {
    it("유효한 개인 신청 → 통과", () => {
      expect(
        step2FormSchema.safeParse({ type: "personal", applicant: validApplicant }).success,
      ).toBe(true);
    });

    it("applicant 이메일 누락 → 실패", () => {
      const result = step2FormSchema.safeParse({
        type: "personal",
        applicant: { ...validApplicant, email: "" },
      });
      expect(result.success).toBe(false);
    });

    it("잘못된 이름으로 실패 시 path가 applicant.name을 가리킴", () => {
      const result = step2FormSchema.safeParse({
        type: "personal",
        applicant: { ...validApplicant, name: "홍1" },
      });
      expect(result.success).toBe(false);
      expect(issueAt(result, "applicant", "name")).toBeDefined();
    });
  });

  describe("단체 신청 (type: group)", () => {
    it("유효한 단체 신청 → 통과", () => {
      expect(
        step2FormSchema.safeParse({
          type: "group",
          applicant: validApplicant,
          group: validGroupInfo,
        }).success,
      ).toBe(true);
    });

    it("group 필드 없으면 → 실패", () => {
      expect(
        step2FormSchema.safeParse({ type: "group", applicant: validApplicant }).success,
      ).toBe(false);
    });

    it("group 내 참가자 이메일 중복 → 실패", () => {
      const result = step2FormSchema.safeParse({
        type: "group",
        applicant: validApplicant,
        group: {
          ...validGroupInfo,
          participants: [
            { name: "홍길동", email: "dup@example.com" },
            { name: "김철수", email: "dup@example.com" },
            { name: "이영희", email: "other@example.com" },
          ],
        },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("잘못된 type", () => {
    it("type이 'admin' → 실패", () => {
      expect(
        step2FormSchema.safeParse({ type: "admin", applicant: validApplicant }).success,
      ).toBe(false);
    });

    it("type 없음 → 실패", () => {
      expect(step2FormSchema.safeParse({ applicant: validApplicant }).success).toBe(false);
    });
  });
});
