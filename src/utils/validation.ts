// src/utils/validation.ts
import { z } from "zod";

// 한국 전화번호 정규식 (하이픈 있거나 없거나 모두 허용)
const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

// 이름 검증 정규식
const koreanNameRegex = /^[가-힣]{2,20}$/; // 한글만 2-20자
const englishNameRegex = /^[a-zA-Z\s]{2,50}$/; // 영어와 공백만 2-50자

// 이름 검증 함수
const nameValidator = z
  .string()
  .min(2, "이름은 최소 2자 이상이어야 합니다.")
  .max(50, "이름은 최대 50자까지 입력 가능합니다.")
  .refine(
    (val) => {
      // 빈 문자열 체크
      if (!val.trim()) return false;

      // 한글 이름인 경우
      if (/[가-힣]/.test(val)) {
        return koreanNameRegex.test(val);
      }

      // 영어 이름인 경우
      if (/[a-zA-Z]/.test(val)) {
        return englishNameRegex.test(val);
      }

      return false;
    },
    {
      message:
        "올바른 이름 형식이 아닙니다. 한글(2-20자) 또는 영어(2-50자)만 입력 가능하며, 숫자나 특수문자는 사용할 수 없습니다.",
    },
  );

// 전화번호 검증 및 정규화 함수
const phoneValidator = z
  .string()
  .min(1, "전화번호를 입력해주세요.")
  .transform((val) => val.replace(/[^\d-]/g, "")) // 숫자와 하이픈만 남김
  .refine((val) => phoneRegex.test(val), {
    message: "올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)",
  });

// 공통 필드 스키마
export const applicantSchema = z.object({
  name: nameValidator,
  email: z
    .string()
    .email("올바른 이메일 형식이 아닙니다.")
    .min(1, "이메일을 입력해주세요."),
  phone: phoneValidator,
  motivation: z
    .string()
    .max(300, "수강 동기는 최대 300자까지 입력 가능합니다.")
    .optional(),
});

// 참가자 스키마
export const participantSchema = z.object({
  name: nameValidator,
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
});

// 단체 정보 스키마
export const groupInfoSchema = z.object({
  organizationName: z
    .string()
    .min(1, "단체명을 입력해주세요.")
    .max(50, "단체명은 최대 50자까지 입력 가능합니다."),
  headCount: z
    .number()
    .min(2, "단체 신청은 최소 2명 이상이어야 합니다.")
    .max(10, "단체 신청은 최대 10명까지 가능합니다."),
  participants: z
    .array(participantSchema)
    .min(2, "최소 2명의 참가자가 필요합니다.")
    .max(10, "최대 10명까지 참가자를 등록할 수 있습니다.")
    .refine(
      (participants) => {
        // 이메일 중복 체크
        const emails = participants.map((p) => p.email);
        return emails.length === new Set(emails).size;
      },
      {
        message: "참가자 이메일이 중복되었습니다.",
      },
    ),
  contactPerson: phoneValidator,
});

// 개인 신청 스키마
export const personalFormSchema = z.object({
  type: z.literal("personal"),
  applicant: applicantSchema,
});

// 단체 신청 스키마
export const groupFormSchema = z.object({
  type: z.literal("group"),
  applicant: applicantSchema,
  group: groupInfoSchema,
});

// 전체 Step2 폼 스키마 (discriminated union)
export const step2FormSchema = z.discriminatedUnion("type", [
  personalFormSchema,
  groupFormSchema,
]);

export type Step2FormData = z.infer<typeof step2FormSchema>;
