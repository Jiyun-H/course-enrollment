// src/components/steps/Step2StudentInfo.tsx
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { formData, updateFormData, setEnrollmentType } = useEnrollmentStore();

  const currentType = formData.type || "personal";
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
    }

    // 단체 → 개인
    if (newType === "personal") {
      const confirmed = window.confirm(
        "개인 신청으로 전환하시겠습니까?\n단체 정보가 삭제됩니다.",
      );
      if (!confirmed) return;
      updateFormData({ group: undefined });
    }

    setValidFormData(null);
    setEnrollmentType(newType);
  };

  const handlePrevStep = () => {
    // 현재 입력된 데이터 저장
    if (validFormData) {
      if (validFormData.type === "personal") {
        updateFormData({
          applicant: validFormData.applicant,
          group: undefined,
        });
      } else {
        updateFormData({
          applicant: validFormData.applicant,
          group: validFormData.group,
        });
      }
    }

    router.push("/enrollment/step/1");
  };

  const handleNextStep = () => {
    if (!validFormData) {
      alert("필수 정보를 모두 입력해주세요.");
      return;
    }

    if (validFormData.type === "personal") {
      updateFormData({
        applicant: validFormData.applicant,
        group: undefined,
      });
    } else {
      updateFormData({
        applicant: validFormData.applicant,
        group: validFormData.group,
      });
    }
    router.push("/enrollment/step/3");
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
        <PersonalForm
          key={`personal-${currentType}`}
          onValidDataChange={handleValidDataChange}
        />
      ) : (
        <GroupForm
          key={`group-${currentType}`}
          onValidDataChange={handleValidDataChange}
        />
      )}

      {/* 디버깅 정보 */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <p>validFormData: {validFormData ? "✅ Valid" : "❌ Invalid"}</p>
          <p>currentType: {currentType}</p>
        </div>
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
