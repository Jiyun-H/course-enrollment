// src/components/steps/step2/GroupForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { groupFormSchema } from "@/utils/validation";
import { Applicant, GroupInfo } from "@/types/enrollment";
import { useEnrollmentStore } from "@/stores/enrollmentStore";
import { useEffect } from "react";
import ApplicantInfoFields from "./ApplicationInfoFields";
import GroupApplicationInfoFields from "./GroupApplicationInfoFields";

type GroupFormInput = {
  type: "group";
  applicant: Applicant;
  group: GroupInfo;
};

type Props = {
  onValidDataChange: (data: GroupFormInput | null) => void;
};

export default function GroupForm({ onValidDataChange }: Props) {
  const { formData } = useEnrollmentStore();

  const {
    register,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors, isValid },
  } = useForm<GroupFormInput>({
    resolver: zodResolver(groupFormSchema),
    mode: "onChange",
    defaultValues: {
      type: "group",
      applicant: {
        name: "",
        email: "",
        phone: "",
        motivation: "",
      },
      group: {
        organizationName: "",
        headCount: 2,
        participants: [],
        contactPerson: "",
      },
    },
  });

  // formData가 변경되면 폼 리셋
  useEffect(() => {
    if (formData.applicant || formData.group) {
      reset({
        type: "group",
        applicant: {
          name: formData.applicant?.name || "",
          email: formData.applicant?.email || "",
          phone: formData.applicant?.phone || "",
          motivation: formData.applicant?.motivation || "",
        },
        group: {
          organizationName: formData.group?.organizationName || "",
          headCount: formData.group?.headCount || 2,
          participants: formData.group?.participants || [],
          contactPerson: formData.group?.contactPerson || "",
        },
      });
    }
  }, [formData.applicant, formData.group, reset]);

  // 개별 필드 watch
  const applicantName = watch("applicant.name");
  const applicantEmail = watch("applicant.email");
  const applicantPhone = watch("applicant.phone");
  const applicantMotivation = watch("applicant.motivation");
  const organizationName = watch("group.organizationName");
  const headCount = watch("group.headCount");
  const contactPerson = watch("group.contactPerson");
  const participants = watch("group.participants") || [];

  useEffect(() => {
    const filledParticipants = participants.filter(
      (p) => p?.name && p?.email,
    ).length;
    const isParticipantsValid = filledParticipants >= (headCount || 2);

    if (isValid && isParticipantsValid) {
      onValidDataChange({
        type: "group",
        applicant: {
          name: applicantName,
          email: applicantEmail,
          phone: applicantPhone,
          motivation: applicantMotivation || undefined,
        },
        group: {
          organizationName,
          headCount: headCount || 2,
          participants: participants.filter((p) => p?.name && p?.email),
          contactPerson,
        },
      });
    } else {
      onValidDataChange(null);
    }
  }, [
    isValid,
    applicantName,
    applicantEmail,
    applicantPhone,
    applicantMotivation,
    organizationName,
    headCount,
    contactPerson,
    participants,
    onValidDataChange,
  ]);

  return (
    <div>
      {/* 신청자 정보 */}
      <ApplicantInfoFields
        register={register}
        errors={errors}
        trigger={trigger}
        setValue={setValue}
      />

      {/* 단체 정보 */}
      <GroupApplicationInfoFields
        register={register}
        errors={errors}
        setValue={setValue}
        headCount={headCount}
      />
    </div>
  );
}
