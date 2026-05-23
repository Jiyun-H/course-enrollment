// src/components/steps/step2/PersonalForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalFormSchema } from "@/utils/validation";
import { Applicant } from "@/types/enrollment";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import { formatPhoneNumber } from "@/utils/formatters";
import { useEffect } from "react";

type PersonalFormInput = {
  type: "personal";
  applicant: Applicant;
};

type Props = {
  onValidDataChange: (data: PersonalFormInput | null) => void;
};

export default function PersonalForm({ onValidDataChange }: Props) {
  const {
    register,
    trigger,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<PersonalFormInput>({
    resolver: zodResolver(personalFormSchema) as any,
    mode: "onChange",
    defaultValues: {
      type: "personal",
      applicant: {
        name: "",
        email: "",
        phone: "",
        motivation: "",
      },
    },
  });

  const name = watch("applicant.name");
  const email = watch("applicant.email");
  const phone = watch("applicant.phone");
  const motivation = watch("applicant.motivation");

  useEffect(() => {
    if (isValid) {
      onValidDataChange({
        type: "personal",
        applicant: {
          name,
          email,
          phone,
          motivation: motivation || "",
        },
      });
    } else {
      onValidDataChange(null);
    }
  }, [isValid, name, email, phone, motivation, onValidDataChange]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue("applicant.phone", formatted);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        개인 신청자 정보
      </h3>

      <Input
        label="이름"
        required
        {...register("applicant.name")}
        onBlur={() => trigger("applicant.name")}
        error={errors.applicant?.name?.message}
        placeholder="홍길동"
      />

      <Input
        label="이메일"
        type="email"
        required
        {...register("applicant.email")}
        onBlur={() => trigger("applicant.email")}
        error={errors.applicant?.email?.message}
        placeholder="example@email.com"
      />

      <Input
        label="전화번호"
        required
        {...register("applicant.phone")}
        onChange={handlePhoneChange}
        onBlur={() => trigger("applicant.phone")}
        error={errors.applicant?.phone?.message}
        placeholder="010-1234-5678"
      />

      <Textarea
        label="수강 동기"
        {...register("applicant.motivation")}
        onBlur={() => trigger("applicant.motivation")}
        error={errors.applicant?.motivation?.message}
        placeholder="수강을 신청하게 된 동기를 간단히 작성해주세요 (선택)"
        rows={4}
        maxLength={300}
      />
    </div>
  );
}
