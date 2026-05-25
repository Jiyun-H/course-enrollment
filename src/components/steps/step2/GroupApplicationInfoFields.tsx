// src/components/steps/step2/GroupApplicationInfoFields.tsx
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
  // ✅ 수정 포인트: setValue에 옵션을 추가하여 실시간 유효성 검증 트리거
  const handleContactPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue("group.contactPerson", formatted, {
      shouldValidate: true, // 값이 바뀔 때마다 에러 검증 즉시 실행
      shouldDirty: true, // 폼 값이 변경되었음을 명시
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
        onChange={handleContactPhoneChange} // 포맷팅 + 검증 트리거 실행
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
  );
}
