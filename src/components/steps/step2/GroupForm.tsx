// src/components/steps/step2/GroupForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { groupFormSchema } from "@/utils/validation";
import { Applicant, GroupInfo } from "@/types/enrollment";
import { useEnrollmentStore } from "@/stores/enrollmentStore";
import { useEffect, useRef } from "react";
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

  const lastSentDataRef = useRef<string | null>(null);

  const {
    register,
    watch,
    setValue,
    trigger,
    reset,
    getValues,
    unregister,
    formState: { errors },
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

  useEffect(() => {
    if (formData.applicant || formData.group) {
      const savedParticipants = formData.group?.participants || [];
      const savedHeadCount = formData.group?.headCount || 2;

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
          headCount: savedHeadCount,
          participants: savedParticipants,
          contactPerson: formData.group?.contactPerson || "",
        },
      });
    }
  }, [formData, reset]);

  const watchedAll = watch();
  const currentHeadCount = Number(watchedAll.group?.headCount) || 2;

  useEffect(() => {
    const currentParticipants = getValues("group.participants") || [];

    if (currentParticipants.length > currentHeadCount) {
      for (let i = currentHeadCount; i < currentParticipants.length; i++) {
        unregister(`group.participants.${i}`);
      }

      setValue(
        "group.participants",
        currentParticipants.slice(0, currentHeadCount),
        { shouldValidate: true },
      );
    }
  }, [currentHeadCount, getValues, setValue, unregister]);

  useEffect(() => {
    const currentValues = getValues();
    const { applicant, group } = currentValues;

    const participants = group?.participants || [];
    const validParticipants = participants.filter(
      (p) => p?.name?.trim() && p?.email?.trim(),
    );

    const requiredCount = Number(group?.headCount) || 2;
    const hasExactParticipants = validParticipants.length === requiredCount;

    const hasRequiredFields = !!(
      applicant?.name?.trim() &&
      applicant?.email?.trim() &&
      applicant?.phone?.trim() &&
      group?.organizationName?.trim() &&
      group?.contactPerson?.trim()
    );

    const hasErrors = Object.keys(errors).length > 0;

    if (!hasErrors && hasRequiredFields && hasExactParticipants) {
      const validData = {
        type: "group" as const,
        applicant: { ...applicant },
        group: {
          ...group,
          headCount: requiredCount,
          participants: validParticipants.slice(0, requiredCount),
        },
      };

      const dataString = JSON.stringify(validData);
      if (lastSentDataRef.current !== dataString) {
        lastSentDataRef.current = dataString;
        onValidDataChange(validData);
      }
    } else {
      if (lastSentDataRef.current !== null) {
        lastSentDataRef.current = null;
        onValidDataChange(null);
      }
    }
  }, [watchedAll, errors, getValues, onValidDataChange]);

  return (
    <div>
      <ApplicantInfoFields
        register={register}
        errors={errors}
        trigger={trigger}
        setValue={setValue}
      />

      <GroupApplicationInfoFields
        register={register}
        errors={errors}
        setValue={setValue}
        headCount={currentHeadCount}
      />
    </div>
  );
}
