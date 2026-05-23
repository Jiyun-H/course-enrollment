// src/components/steps/step2/GroupForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { groupFormSchema } from "@/utils/validation";
import { Applicant, GroupInfo } from "@/types/enrollment";
import Input from "@/components/common/Input";
import { formatPhoneNumber } from "@/utils/formatters";
import { useEffect } from "react";
import ApplicantInfoFields from "./ApplicationInfoFields";

type GroupFormInput = {
  type: "group";
  applicant: Applicant;
  group: GroupInfo;
};

type Props = {
  onValidDataChange: (data: GroupFormInput | null) => void;
};

export default function GroupForm({ onValidDataChange }: Props) {
  const {
    register,
    watch,
    setValue,
    trigger,
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

  // 개별 필드 watch
  const applicantName = watch("applicant.name");
  const applicantEmail = watch("applicant.email");
  const applicantPhone = watch("applicant.phone");
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
          motivation: "",
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
    organizationName,
    headCount,
    contactPerson,
    participants,
    onValidDataChange,
  ]);

  const handleContactPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue("group.contactPerson", formatted);
  };

  const participantCount = headCount || 2;
  const participantIndexes = Array.from(
    { length: participantCount },
    (_, i) => i,
  );

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
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">단체 정보</h3>

        <Input
          label="단체명"
          required
          {...register("group.organizationName")}
          error={errors.group?.organizationName?.message}
          placeholder="회사명 또는 단체명"
        />

        <Input
          label="신청 인원수"
          type="number"
          required
          {...register("group.headCount", { valueAsNumber: true })}
          error={errors.group?.headCount?.message}
          placeholder="2"
          min={2}
          max={10}
        />

        <Input
          label="담당자 연락처"
          required
          {...register("group.contactPerson")}
          onChange={handleContactPhoneChange}
          error={errors.group?.contactPerson?.message}
          placeholder="010-1234-5678"
        />

        {/* 참가자 명단 */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            참가자 명단
            <span className="text-red-500 ml-1">*</span>
          </label>

          <div className="space-y-4">
            {participantIndexes.map((index) => {
              const hasNameError = errors.group?.participants?.[index]?.name;
              const hasEmailError = errors.group?.participants?.[index]?.email;

              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="text-sm font-medium text-gray-700 mb-3">
                    참가자 {index + 1}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 이름 필드 */}
                    <div>
                      <input
                        {...register(`group.participants.${index}.name`)}
                        placeholder="이름"
                        className={`
                          w-full px-4 py-2 border rounded-lg transition-colors
                          ${
                            hasNameError
                              ? "border-red-500"
                              : "border-gray-300 focus:border-blue-500"
                          }
                          focus:outline-none focus:ring-2
                        `}
                      />
                      {hasNameError && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.group?.participants?.[index]?.name?.message}
                        </p>
                      )}
                    </div>

                    {/* 이메일 필드 */}
                    <div>
                      <input
                        {...register(`group.participants.${index}.email`)}
                        type="email"
                        placeholder="이메일"
                        className={`
                          w-full px-4 py-2 border rounded-lg transition-colors
                          ${
                            hasEmailError
                              ? "border-red-500"
                              : "border-gray-300 focus:border-blue-500"
                          }
                          focus:outline-none focus:ring-2
                        `}
                      />
                      {hasEmailError && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.group?.participants?.[index]?.email?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
