// src/components/steps/Step2StudentInfo.tsx
"use client";

import { useState, useCallback } from "react";
import { useEnrollmentStore } from "@/stores/enrollmentStore";
import PersonalForm from "./step2/PersonalForm";
import GroupForm from "./step2/GroupForm";
import { Applicant, GroupInfo } from "@/types/enrollment";

type PersonalFormData = {
  type: "personal";
  applicant: Applicant;
};

type GroupFormData = {
  type: "group";
  applicant: Applicant;
  group: GroupInfo;
};

type FormData = PersonalFormData | GroupFormData | null;

export default function Step2StudentInfo() {
  const { formData, updateFormData, setEnrollmentType, nextStep, prevStep } =
    useEnrollmentStore();

  const [currentType, setCurrentType] = useState<"personal" | "group">(
    formData.type || "personal",
  );
  const [validFormData, setValidFormData] = useState<FormData>(null);

  const handleValidDataChange = useCallback((data: FormData) => {
    setValidFormData(data);
  }, []);

  const handleTypeChange = (newType: "personal" | "group") => {
    if (newType === currentType) return;

    // 개인 → 단체
    if (newType === "group") {
      const confirmed = window.confirm(
        "단체 신청으로 전환하시겠습니까?\n입력한 개인 정보는 대표 신청자 정보로 입력됩니다.",
      );
      if (!confirmed) return;
      updateFormData({ applicant: undefined });
    }

    // 단체 → 개인
    if (newType === "personal") {
      const confirmed = window.confirm("개인 신청으로 전환하시겠습니까?");
      if (!confirmed) return;
      updateFormData({ group: undefined });
    }

    setEnrollmentType(newType);
    setCurrentType(newType);
    setValidFormData(null);
  };

  const handlePrevStep = () => {
    const confirmed = window.confirm(
      "이전 단계로 이동하시겠습니까?\n입력한 정보가 저장되지 않을 수 있습니다.",
    );

    if (!confirmed) {
      // 데이터 초기화
      updateFormData({
        applicant: undefined,
        group: undefined,
      });
      prevStep();
    }
  };

  const handleNextStep = () => {
    if (!validFormData) {
      alert("모든 필수 항목을 올바르게 입력해주세요.");
      return;
    }

    if (validFormData.type === "personal") {
      updateFormData({
        applicant: validFormData.applicant,
        group: undefined,
      });
    } else {
      updateFormData({
        applicant: undefined,
        group: validFormData.group,
      });
    }
    nextStep();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8">2단계: 수강생 정보 입력</h2>

      {/* 신청 유형 선택 */}
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

      {/* 조건부 폼 렌더링 */}
      {currentType === "personal" ? (
        <PersonalForm onValidDataChange={handleValidDataChange} />
      ) : (
        <GroupForm onValidDataChange={handleValidDataChange} />
      )}

      {/* 버튼 (공통) */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={handlePrevStep}
          className="px-8 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          이전 단계
        </button>
        <button
          type="button"
          onClick={handleNextStep}
          disabled={!validFormData}
          className={`
            px-8 py-3 rounded-lg font-semibold text-white transition-colors
            ${
              validFormData
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"
            }
          `}
        >
          다음 단계
        </button>
      </div>
    </div>
  );
}
