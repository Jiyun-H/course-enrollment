// src/components/steps/step2/PersonalForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalFormSchema } from "@/utils/validation";
import { Applicant } from "@/types/enrollment";
import ApplicantInfoFields from "./ApplicantInfoFields";
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

  const formData = watch();

  // 폼 데이터가 유효할 때만 부모에게 전달
  useEffect(() => {
    if (isValid) {
      onValidDataChange(formData);
    } else {
      onValidDataChange(null);
    }
  }, [formData, isValid, onValidDataChange]);

  return (
    <div>
      <ApplicantInfoFields
        register={register}
        errors={errors}
        trigger={trigger}
        setValue={setValue}
      />
    </div>
  );
}
