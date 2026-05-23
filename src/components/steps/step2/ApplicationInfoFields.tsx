// src/components/steps/step2/ApplicantInfoFields.tsx
"use client";

import {
  UseFormRegister,
  FieldErrors,
  UseFormTrigger,
  UseFormSetValue,
} from "react-hook-form";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import { formatPhoneNumber } from "@/utils/formatters";

type ApplicantInfo = {
  name: string;
  email: string;
  phone: string;
  motivation?: string;
};

type Props<T extends { applicant: ApplicantInfo }> = {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  trigger: UseFormTrigger<T>;
  setValue: UseFormSetValue<T>;
};

export default function ApplicantInfoFields<
  T extends { applicant: ApplicantInfo },
>({ register, errors, trigger, setValue }: Props<T>) {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue("applicant.phone" as any, formatted);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">신청자 정보</h3>

      <Input
        label="이름"
        required
        {...register("applicant.name" as any)}
        onBlur={() => trigger("applicant.name" as any)}
        error={errors.applicant?.name?.message}
        placeholder="홍길동"
      />

      <Input
        label="이메일"
        type="email"
        required
        {...register("applicant.email" as any)}
        onBlur={() => trigger("applicant.email" as any)}
        error={errors.applicant?.email?.message}
        placeholder="example@email.com"
      />

      <Input
        label="전화번호"
        required
        {...register("applicant.phone" as any)}
        onChange={handlePhoneChange}
        onBlur={() => trigger("applicant.phone" as any)}
        error={errors.applicant?.phone?.message}
        placeholder="010-1234-5678"
      />

      <Textarea
        label="수강 동기"
        {...register("applicant.motivation" as any)}
        onBlur={() => trigger("applicant.motivation" as any)}
        placeholder="수강을 신청하게 된 동기를 간단히 작성해주세요 (선택)"
        rows={4}
        maxLength={300}
      />
    </div>
  );
}
