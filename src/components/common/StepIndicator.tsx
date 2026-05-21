// src/components/common/StepIndicator.tsx
"use client";

import React from "react";
import { Step } from "@/types/enrollment";

interface StepIndicatorProps {
  currentStep: Step;
  onStepClick?: (step: Step) => void;
}

const steps = [
  { number: 1, label: "강의 선택" },
  { number: 2, label: "수강생 정보" },
  { number: 3, label: "확인 및 제출" },
];

export default function StepIndicator({
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  const handleStepClick = (stepNumber: Step) => {
    // 완료된 스텝(파란색)만 클릭 가능
    if (stepNumber < currentStep) {
      const confirmed = window.confirm(
        "이전 단계로 이동하시겠습니까? 현재 작성 중인 정보는 저장되지 않을 수 있습니다.",
      );
      if (confirmed && onStepClick) {
        onStepClick(stepNumber);
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      {/* 원과 연결선 */}
      <div className="flex items-center justify-between mb-3">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {/* 스텝 원 */}
            <div
              onClick={() => handleStepClick(step.number as Step)}
              className={`
                w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold
                transition-colors duration-200 flex-shrink-0
                ${
                  step.number === currentStep
                    ? "bg-blue-600 text-white"
                    : step.number < currentStep
                      ? "bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                      : "bg-gray-200 text-gray-500"
                }
              `}
            >
              {step.number}
            </div>

            {/* 연결선 (마지막 스텝 제외) */}
            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-1 mx-4 transition-colors duration-200
                  ${step.number < currentStep ? "bg-blue-600" : "bg-gray-200"}
                `}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 라벨 */}
      <div className="flex items-center justify-between">
        {steps.map((step) => (
          <div key={step.number} className="w-12 flex justify-center">
            <span
              className={`
                text-sm font-medium whitespace-nowrap
                ${
                  step.number === currentStep
                    ? "text-blue-600"
                    : step.number < currentStep
                      ? "text-gray-700"
                      : "text-gray-400"
                }
              `}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
