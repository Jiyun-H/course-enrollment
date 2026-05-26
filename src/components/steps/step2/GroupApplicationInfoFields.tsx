"use client";

import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { formatPhoneNumber } from "@/utils/formatters";
import Input from "@/components/common/Input";

type GroupFormInput = {
  type: "group";
  applicant: {
    name: string;
    email: string;
    phone: string;
    motivation?: string;
  };
  group: {
    organizationName: string;
    headCount: number;
    participants: Array<{ name: string; email: string }>;
    contactPerson: string;
  };
};

type Props = {
  register: UseFormRegister<GroupFormInput>;
  errors: FieldErrors<GroupFormInput>;
  setValue: UseFormSetValue<GroupFormInput>;
  headCount: number;
};

export default function GroupApplicationInfoFields({
  register,
  errors,
  setValue,
  headCount,
}: Props) {
  const handleContactPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue("group.contactPerson", formatted, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const participantCount = headCount || 2;
  const participantIndexes = Array.from(
    { length: participantCount },
    (_, i) => i,
  );

  return (
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
            const nameError =
              errors.group?.participants?.[index]?.name?.message;
            const emailError =
              errors.group?.participants?.[index]?.email?.message;

            return (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4"
              >
                <div className="text-sm font-bold text-blue-600 mb-4">
                  참가자 {index + 1}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                  <Input
                    label="이름"
                    placeholder="이름"
                    {...register(`group.participants.${index}.name`)}
                    error={nameError}
                  />
                  <Input
                    label="이메일"
                    type="email"
                    placeholder="이메일"
                    {...register(`group.participants.${index}.email`)}
                    error={emailError}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
