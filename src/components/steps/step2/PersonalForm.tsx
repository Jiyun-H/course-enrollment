// src/components/steps/step2/PersonalForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalFormSchema } from "@/utils/validation";
import { Applicant } from "@/types/enrollment";
import { useEffect } from "react";
import { useEnrollmentStore } from "@/stores/enrollmentStore";
import ApplicantInfoFields from "./ApplicationInfoFields";

type PersonalFormInput = {
  type: "personal";
  applicant: Applicant;
};

type Props = {
  onValidDataChange: (data: PersonalFormInput | null) => void;
};

export default function PersonalForm({ onValidDataChange }: Props) {
  const { formData } = useEnrollmentStore();

  const {
    register,
    trigger,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<PersonalFormInput>({
    resolver: zodResolver(personalFormSchema),
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

  //formData가 변경되면 폼 리셋
  useEffect(() => {
    if (formData.applicant) {
      reset({
        type: "personal",
        applicant: {
          name: formData.applicant.name || "",
          email: formData.applicant.email || "",
          phone: formData.applicant.phone || "",
          motivation: formData.applicant.motivation || "",
        },
      });
    }
  }, [formData.applicant, reset]);

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
          motivation: motivation || undefined,
        },
      });
    } else {
      onValidDataChange(null);
    }
  }, [isValid, name, email, phone, motivation, onValidDataChange]);

  return (
    <ApplicantInfoFields
      register={register}
      errors={errors}
      trigger={trigger}
      setValue={setValue}
    />
  );
}
