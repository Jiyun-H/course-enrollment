// src/components/steps/Step2StudentInfo.tsx
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEnrollmentStore } from "@/stores/enrollmentStore";
import { step2FormSchema } from "@/utils/validation";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import { useState, useEffect } from "react";
import { Applicant, GroupInfo } from "@/types/enrollment";
import { formatPhoneNumber } from "@/utils/formatters";

// 폼 타입
type Step2FormInput = {
  type: "personal" | "group";
  applicant: Applicant;
  group?: GroupInfo;
};

export default function Step2StudentInfo() {
  const { formData, updateFormData, setEnrollmentType, nextStep, prevStep } =
    useEnrollmentStore();

  const [showGroupFields, setShowGroupFields] = useState(
    formData.type === "group",
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm<Step2FormInput>({
    resolver: zodResolver(step2FormSchema) as any,
    mode: "onBlur",
    defaultValues: {
      type: formData.type,
      applicant: {
        name: "",
        email: "",
        phone: "",
        motivation: "",
      },
      group: undefined,
    },
  });

  const currentType = watch("type");
  const headCount = watch("group.headCount");

  // 컴포넌트 마운트 시 폼 초기화
  useEffect(() => {
    reset({
      type: formData.type,
      applicant: {
        name: "",
        email: "",
        phone: "",
        motivation: "",
      },
      group: undefined,
    });
    setShowGroupFields(formData.type === "group");
  }, [formData.type, reset]);

  const handleTypeChange = (newType: "personal" | "group") => {
    if (newType === currentType) return;

    if (newType === "personal" && formData.group) {
      const confirmed = window.confirm(
        "개인 신청으로 전환하시겠습니까?\n입력한 단체 정보가 삭제됩니다.",
      );
      if (!confirmed) return;
    }

    if (newType === "group") {
      const confirmed = window.confirm("단체 신청으로 전환하시겠습니까?");
      if (!confirmed) return;
    }

    setEnrollmentType(newType);
    setValue("type", newType);
    setShowGroupFields(newType === "group");

    if (newType === "personal") {
      updateFormData({ group: undefined });
      setValue("group", undefined);
    }
  };

  // 이전 단계로 돌아갈 때 현재 입력 데이터 초기화
  const handlePrevStep = () => {
    updateFormData({
      applicant: {
        name: "",
        email: "",
        phone: "",
        motivation: "",
      },
      group: undefined,
    });
    prevStep();
  };

  // 전화번호 포맷팅 핸들러
  const handlePhoneChange = (
    fieldName: "applicant.phone" | "group.contactPerson",
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue(fieldName, formatted);
  };

  const participantCount = headCount || 2;
  const participantIndexes = Array.from(
    { length: participantCount },
    (_, i) => i,
  );

  const onSubmit: SubmitHandler<Step2FormInput> = (data) => {
    updateFormData({
      applicant: data.applicant,
      group: data.type === "group" ? data.group : undefined,
    });
    nextStep();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8">2단계: 수강생 정보 입력</h2>

      {/* noValidate 추가로 브라우저 기본 validation 제거 */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* 신청 유형 전환 */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            신청 유형
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleTypeChange("personal")}
              className={`
                p-4 rounded-lg border-2 text-left transition-all
                ${
                  currentType === "personal"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
            >
              <div className="font-semibold text-gray-900 mb-1">개인 신청</div>
              <div className="text-sm text-gray-600">
                개인 자격으로 수강 신청합니다
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("group")}
              className={`
                p-4 rounded-lg border-2 text-left transition-all
                ${
                  currentType === "group"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
            >
              <div className="font-semibold text-gray-900 mb-1">단체 신청</div>
              <div className="text-sm text-gray-600">
                2명 이상 단체로 수강 신청합니다
              </div>
            </button>
          </div>
        </div>

        {/* 공통 필드 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            신청자 정보
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
            onChange={(e) => handlePhoneChange("applicant.phone", e)}
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

        {/* 단체 신청 조건부 필드 */}
        {showGroupFields && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              단체 정보
            </h3>

            <Input
              label="단체명"
              required
              {...register("group.organizationName")}
              onBlur={() => trigger("group.organizationName")}
              error={errors.group?.organizationName?.message}
              placeholder="회사명 또는 단체명"
            />

            <Input
              label="신청 인원수"
              type="number"
              required
              {...register("group.headCount", { valueAsNumber: true })}
              onBlur={() => trigger("group.headCount")}
              error={errors.group?.headCount?.message}
              placeholder="2"
              min={2}
              max={10}
            />

            <Input
              label="담당자 연락처"
              required
              {...register("group.contactPerson")}
              onChange={(e) => handlePhoneChange("group.contactPerson", e)}
              onBlur={() => trigger("group.contactPerson")}
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
                {participantIndexes.map((index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="text-sm font-medium text-gray-700 mb-3">
                      참가자 {index + 1}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input
                          {...register(`group.participants.${index}.name`)}
                          onBlur={() =>
                            trigger(`group.participants.${index}.name`)
                          }
                          placeholder="이름"
                          className={`
                            w-full px-4 py-2 border rounded-lg transition-colors
                            ${
                              errors.group?.participants?.[index]?.name
                                ? "border-red-500"
                                : "border-gray-300 focus:border-blue-500"
                            }
                            focus:outline-none focus:ring-2
                          `}
                        />
                        {errors.group?.participants?.[index]?.name && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.group.participants[index]?.name?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <input
                          {...register(`group.participants.${index}.email`)}
                          onBlur={() =>
                            trigger(`group.participants.${index}.email`)
                          }
                          type="email"
                          placeholder="이메일"
                          className={`
                            w-full px-4 py-2 border rounded-lg transition-colors
                            ${
                              errors.group?.participants?.[index]?.email
                                ? "border-red-500"
                                : "border-gray-300 focus:border-blue-500"
                            }
                            focus:outline-none focus:ring-2
                          `}
                        />
                        {errors.group?.participants?.[index]?.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.group.participants[index]?.email?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 버튼 */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handlePrevStep}
            className="px-8 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            이전 단계
          </button>
          <button
            type="submit"
            className="px-8 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            다음 단계
          </button>
        </div>
      </form>
    </div>
  );
}
