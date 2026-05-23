// src/app/page.tsx
"use client";

import { useEnrollmentStore } from "@/stores/enrollmentStore";
import StepIndicator from "@/components/common/StepIndicator";
import Step1CourseSelection from "@/components/steps/Step1CourseSelection";
import Step2StudentInfo from "@/components/steps/Step2StudentInfo";
import { Step } from "@/types/enrollment";

export default function Home() {
  const { currentStep, setStep } = useEnrollmentStore();

  const handleStepClick = (step: Step) => {
    setStep(step);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
          수강 신청
        </h1>

        <StepIndicator
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        {currentStep === 1 && <Step1CourseSelection />}
        {currentStep === 2 && <Step2StudentInfo />}
        {currentStep === 3 && <div>Step 3 (작업 예정)</div>}
      </div>
    </main>
  );
}
