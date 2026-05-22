// src/utils/validation.ts
import { z } from "zod";

const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
const koreanNameRegex = /^[가-힣]{2,20}$/;
const englishNameRegex = /^[a-zA-Z\s]{2,50}$/;

const nameValidator = z
  .string()
  .min(2, "이름은 최소 2자 이상이어야 합니다.")
  .max(50, "이름은 최대 50자까지 입력 가능합니다.")
  .refine(
    (val) => {
      if (!val.trim()) return false;
      if (/[가-힣]/.test(val)) {
        return koreanNameRegex.test(val);
      }
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

const phoneValidator = z
  .string()
  .min(1, "전화번호를 입력해주세요.")
  .transform((val) => val.replace(/[^\d-]/g, ""))
  .refine((val) => phoneRegex.test(val), {
    message: "올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)",
  });

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

export const participantSchema = z.object({
  name: nameValidator,
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
});

// superRefine으로 개별 필드에 에러 매핑(group신청시 중복 확인을 위해)
export const groupInfoSchema = z
  .object({
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
      .max(10, "최대 10명까지 참가자를 등록할 수 있습니다."),
    contactPerson: phoneValidator,
  })
  .superRefine((data, ctx) => {
    const { participants } = data;

    // 이름 중복 체크
    const nameMap = new Map<string, number[]>();
    participants.forEach((participant, index) => {
      const name = participant.name.toLowerCase().trim();
      if (!nameMap.has(name)) {
        nameMap.set(name, []);
      }
      nameMap.get(name)!.push(index);
    });

    nameMap.forEach((indexes, name) => {
      if (indexes.length > 1) {
        // 첫 번째는 제외하고 나머지에 에러 추가
        indexes.slice(1).forEach((idx) => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "중복된 이름입니다",
            path: ["participants", idx, "name"],
          });
        });
      }
    });

    // 이메일 중복 체크
    const emailMap = new Map<string, number[]>();
    participants.forEach((participant, index) => {
      const email = participant.email.toLowerCase().trim();
      if (!emailMap.has(email)) {
        emailMap.set(email, []);
      }
      emailMap.get(email)!.push(index);
    });

    emailMap.forEach((indexes, email) => {
      if (indexes.length > 1) {
        // 첫 번째는 제외하고 나머지에 에러 추가
        indexes.slice(1).forEach((idx) => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "중복된 이메일입니다",
            path: ["participants", idx, "email"],
          });
        });
      }
    });
  });

export const personalFormSchema = z.object({
  type: z.literal("personal"),
  applicant: applicantSchema,
});

export const groupFormSchema = z.object({
  type: z.literal("group"),
  group: groupInfoSchema,
});

export const step2FormSchema = z.discriminatedUnion("type", [
  personalFormSchema,
  groupFormSchema,
]);

export type Step2FormData = z.infer<typeof step2FormSchema>;
